import { pgTable, text, serial, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type", { enum: ["learn", "teach", "both"] }).notNull().default("learn"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  username: true,
  password: true,
  userType: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Skill model
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  iconName: text("icon_name")
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  category: true,
  description: true,
  iconName: true,
});

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

// UserSkill model (for the many-to-many relationship)
export const userSkills = pgTable("user_skills", {
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  isTeaching: boolean("is_teaching").notNull().default(false),
  isLearning: boolean("is_learning").notNull().default(false),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).default("beginner"),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.skillId] }),
}));

export const insertUserSkillSchema = createInsertSchema(userSkills).pick({
  userId: true,
  skillId: true,
  isTeaching: true,
  isLearning: true,
  level: true,
});

export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;
export type UserSkill = typeof userSkills.$inferSelect;

// Connection model (represents teacher-student relationships)
export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => users.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  status: text("status", { enum: ["pending", "accepted", "rejected"] }).notNull().default("pending"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertConnectionSchema = createInsertSchema(connections).pick({
  teacherId: true,
  studentId: true,
  message: true,
});

export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connections.$inferSelect;

// Category model (for specialties)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  iconName: text("icon_name"),
  imageUrl: text("image_url"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  iconName: true,
  imageUrl: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
