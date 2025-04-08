import { users, type User, type InsertUser, skills, type Skill, type InsertSkill, userSkills, type UserSkill, type InsertUserSkill, connections, type Connection, type InsertConnection, categories, type Category, type InsertCategory } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Skill methods
  getSkill(id: number): Promise<Skill | undefined>;
  getSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  
  // UserSkill methods
  getUserSkills(userId: number): Promise<(UserSkill & { skill: Skill })[]>;
  addUserSkill(userSkill: InsertUserSkill): Promise<UserSkill>;
  updateUserSkill(userId: number, skillId: number, updates: Partial<UserSkill>): Promise<UserSkill | undefined>;
  removeUserSkill(userId: number, skillId: number): Promise<void>;
  
  // Connection methods
  getConnection(id: number): Promise<Connection | undefined>;
  getConnections(userId: number, role: 'teacher' | 'student'): Promise<(Connection & { user: User })[]>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  updateConnectionStatus(id: number, status: 'accepted' | 'rejected'): Promise<Connection | undefined>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getPopularCategories(limit?: number): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private skills: Map<number, Skill>;
  private userSkills: Map<string, UserSkill>;
  private connections: Map<number, Connection>;
  private categories: Map<number, Category>;
  currentId: {
    users: number;
    skills: number;
    connections: number;
    categories: number;
  };
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.skills = new Map();
    this.userSkills = new Map();
    this.connections = new Map();
    this.categories = new Map();
    this.currentId = {
      users: 1,
      skills: 1,
      connections: 1,
      categories: 1
    };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with some categories and skills
    this.initializeData();
  }

  private initializeData() {
    // Add some categories
    const categories = [
      { name: "Programação", description: "Desenvolvimento de software e web", iconName: "code-line", imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97" },
      { name: "Idiomas", description: "Aprendizado de idiomas estrangeiros", iconName: "translate", imageUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580" },
      { name: "Música", description: "Instrumentos musicais e teoria", iconName: "music-2-line", imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48" },
      { name: "Culinária", description: "Técnicas de cozinha e receitas", iconName: "restaurant-line", imageUrl: "https://images.unsplash.com/photo-1601784551167-2c698216cad7" },
      { name: "Esportes", description: "Diferentes modalidades esportivas", iconName: "basketball-line", imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5" },
      { name: "Negócios", description: "Empreendedorismo e gestão", iconName: "briefcase-line", imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0" },
      { name: "Matemática", description: "Cálculo, álgebra e estatística", iconName: "calculator-line", imageUrl: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7" },
      { name: "Design", description: "Design gráfico e UX/UI", iconName: "palette-line", imageUrl: "https://unsplash.com/photos/a-colorful-abstract-painting-with-a-teal-background-S_uHLJTnb5o" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Add some skills
    const skills = [
      { name: "HTML/CSS", category: "Programação", description: "Fundamentos de web", iconName: "code-s-slash-line" },
      { name: "JavaScript", category: "Programação", description: "Linguagem de programação web", iconName: "javascript-line" },
      { name: "React", category: "Programação", description: "Biblioteca para interfaces", iconName: "reactjs-line" },
      { name: "Inglês", category: "Idiomas", description: "Idioma global", iconName: "english-input" },
      { name: "Espanhol", category: "Idiomas", description: "Segunda língua mais falada", iconName: "spain-fill" },
      { name: "Piano", category: "Música", description: "Instrumento de teclas", iconName: "music-line" },
      { name: "Violão", category: "Música", description: "Instrumento de cordas", iconName: "guitar-line" }
    ];
    
    skills.forEach(skill => {
      this.createSkill(skill);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Skill methods
  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      skill => skill.category === category
    );
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentId.skills++;
    const newSkill: Skill = { ...skill, id };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  // UserSkill methods
  async getUserSkills(userId: number): Promise<(UserSkill & { skill: Skill })[]> {
    const userSkillsArray = Array.from(this.userSkills.values())
      .filter(userSkill => userSkill.userId === userId);
    
    return userSkillsArray.map(userSkill => {
      const skill = this.skills.get(userSkill.skillId)!;
      return { ...userSkill, skill };
    });
  }

  async addUserSkill(userSkill: InsertUserSkill): Promise<UserSkill> {
    const key = `${userSkill.userId}-${userSkill.skillId}`;
    this.userSkills.set(key, userSkill as UserSkill);
    return userSkill as UserSkill;
  }

  async updateUserSkill(userId: number, skillId: number, updates: Partial<UserSkill>): Promise<UserSkill | undefined> {
    const key = `${userId}-${skillId}`;
    const userSkill = this.userSkills.get(key);
    
    if (!userSkill) return undefined;
    
    const updatedUserSkill: UserSkill = { ...userSkill, ...updates };
    this.userSkills.set(key, updatedUserSkill);
    
    return updatedUserSkill;
  }

  async removeUserSkill(userId: number, skillId: number): Promise<void> {
    const key = `${userId}-${skillId}`;
    this.userSkills.delete(key);
  }

  // Connection methods
  async getConnection(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async getConnections(userId: number, role: 'teacher' | 'student'): Promise<(Connection & { user: User })[]> {
    const field = role === 'teacher' ? 'teacherId' : 'studentId';
    const otherField = role === 'teacher' ? 'studentId' : 'teacherId';
    
    const connections = Array.from(this.connections.values())
      .filter(connection => connection[field] === userId);
    
    return connections.map(connection => {
      const user = this.users.get(connection[otherField])!;
      return { ...connection, user };
    });
  }

  async createConnection(connection: InsertConnection): Promise<Connection> {
    const id = this.currentId.connections++;
    const now = new Date();
    const newConnection: Connection = { 
      ...connection, 
      id, 
      status: 'pending',
      createdAt: now
    };
    
    this.connections.set(id, newConnection);
    return newConnection;
  }

  async updateConnectionStatus(id: number, status: 'accepted' | 'rejected'): Promise<Connection | undefined> {
    const connection = this.connections.get(id);
    
    if (!connection) return undefined;
    
    const updatedConnection: Connection = { ...connection, status };
    this.connections.set(id, updatedConnection);
    
    return updatedConnection;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getPopularCategories(limit = 5): Promise<Category[]> {
    return Array.from(this.categories.values()).slice(0, limit);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentId.categories++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
}

export const storage = new MemStorage();
