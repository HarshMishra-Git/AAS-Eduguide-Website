import { type User, type InsertUser, type Lead, type InsertLead, type Newsletter, type InsertNewsletter, type Contact, type InsertContact, type BamsAdmission, type InsertBamsAdmission, users, leads, newsletters, contacts, bamsAdmissions } from "@shared/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  
  // Newsletter methods
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getNewsletterSubscriptions(): Promise<Newsletter[]>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // BAMS admission methods
  createBamsAdmission(bamsAdmission: InsertBamsAdmission): Promise<BamsAdmission>;
  getBamsAdmissions(): Promise<BamsAdmission[]>;
  
  // Delete methods
  deleteRecord(table: string, id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    try {
      const result = await db.insert(leads).values(insertLead).returning();
      logger.info('Lead created successfully', { email: insertLead.email });
      return result[0];
    } catch (error) {
      logger.error('Failed to create lead', { error, data: insertLead });
      throw error;
    }
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    try {
      const result = await db.insert(newsletters).values(insertNewsletter).returning();
      logger.info('Newsletter subscription created', { email: insertNewsletter.email });
      return result[0];
    } catch (error) {
      logger.error('Failed to create newsletter subscription', { error, data: insertNewsletter });
      throw error;
    }
  }

  async getNewsletterSubscriptions(): Promise<Newsletter[]> {
    return await db.select().from(newsletters).orderBy(desc(newsletters.subscribedAt));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    try {
      const result = await db.insert(contacts).values(insertContact).returning();
      logger.info('Contact created successfully', { email: insertContact.email });
      return result[0];
    } catch (error) {
      logger.error('Failed to create contact', { error, data: insertContact });
      throw error;
    }
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createBamsAdmission(insertBamsAdmission: InsertBamsAdmission): Promise<BamsAdmission> {
    try {
      const result = await db.insert(bamsAdmissions).values(insertBamsAdmission).returning();
      logger.info('BAMS admission created successfully', { email: insertBamsAdmission.email });
      return result[0];
    } catch (error) {
      logger.error('Failed to create BAMS admission', { error, data: insertBamsAdmission });
      throw error;
    }
  }

  async getBamsAdmissions(): Promise<BamsAdmission[]> {
    return await db.select().from(bamsAdmissions).orderBy(desc(bamsAdmissions.createdAt));
  }

  async deleteRecord(table: string, id: string): Promise<void> {
    try {
      switch (table) {
        case 'leads':
          await db.delete(leads).where(eq(leads.id, id));
          logger.info('Lead deleted successfully', { id });
          break;
        case 'contacts':
          await db.delete(contacts).where(eq(contacts.id, id));
          logger.info('Contact deleted successfully', { id });
          break;
        case 'bams_admissions':
          await db.delete(bamsAdmissions).where(eq(bamsAdmissions.id, id));
          logger.info('BAMS admission deleted successfully', { id });
          break;
        case 'newsletters':
          await db.delete(newsletters).where(eq(newsletters.id, id));
          logger.info('Newsletter subscription deleted successfully', { id });
          break;
        default:
          throw new Error(`Invalid table: ${table}`);
      }
    } catch (error) {
      logger.error('Failed to delete record', { error, table, id });
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
