import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSkillSchema, insertConnectionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/popular", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const categories = await storage.getPopularCategories(limit);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      let skills;
      if (req.query.category) {
        skills = await storage.getSkillsByCategory(req.query.category as string);
      } else {
        skills = await storage.getSkills();
      }
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.get("/api/skills/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const skill = await storage.getSkill(id);
      
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      
      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skill" });
    }
  });

  // User skills routes
  app.get("/api/user-skills", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const userSkills = await storage.getUserSkills(req.user!.id);
      res.json(userSkills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user skills" });
    }
  });

  app.post("/api/user-skills", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const validatedData = insertUserSkillSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const skill = await storage.getSkill(validatedData.skillId);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      
      const userSkill = await storage.addUserSkill(validatedData);
      res.status(201).json(userSkill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to add user skill" });
    }
  });

  app.patch("/api/user-skills/:skillId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const skillId = parseInt(req.params.skillId);
      const updates = req.body;
      
      const updatedUserSkill = await storage.updateUserSkill(req.user!.id, skillId, updates);
      
      if (!updatedUserSkill) {
        return res.status(404).json({ error: "User skill not found" });
      }
      
      res.json(updatedUserSkill);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user skill" });
    }
  });

  app.delete("/api/user-skills/:skillId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const skillId = parseInt(req.params.skillId);
      await storage.removeUserSkill(req.user!.id, skillId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove user skill" });
    }
  });

  // Connections routes
  app.get("/api/connections", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const role = req.query.role as 'teacher' | 'student' || 'student';
      const connections = await storage.getConnections(req.user!.id, role);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      let validatedData;
      
      if (req.body.teacherId) {
        // User is a student connecting with a teacher
        validatedData = insertConnectionSchema.parse({
          ...req.body,
          studentId: req.user!.id
        });
      } else if (req.body.studentId) {
        // User is a teacher connecting with a student
        validatedData = insertConnectionSchema.parse({
          ...req.body,
          teacherId: req.user!.id
        });
      } else {
        return res.status(400).json({ error: "Either teacherId or studentId must be provided" });
      }
      
      const connection = await storage.createConnection(validatedData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create connection" });
    }
  });

  app.patch("/api/connections/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (status !== 'accepted' && status !== 'rejected') {
        return res.status(400).json({ error: "Status must be 'accepted' or 'rejected'" });
      }
      
      const connection = await storage.getConnection(id);
      
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      // Verify that the user is the recipient of the connection request
      if (connection.teacherId !== req.user!.id && connection.studentId !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to update this connection" });
      }
      
      const updatedConnection = await storage.updateConnectionStatus(id, status);
      res.json(updatedConnection);
    } catch (error) {
      res.status(500).json({ error: "Failed to update connection status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
