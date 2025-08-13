import { vehicles, type Vehicle, type InsertVehicle } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: number): Promise<Vehicle | undefined>;
  createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, insertVehicle: InsertVehicle): Promise<Vehicle>;
  deleteVehicle(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getVehicles(): Promise<Vehicle[]> {
    try {
      console.log("Fetching vehicles from database...");
      const result = await db.select().from(vehicles).orderBy(vehicles.createdAt);
      console.log(`Found ${result.length} vehicles`);
      return result;
    } catch (error) {
      console.error("Database error in getVehicles:", error);
      throw error;
    }
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    try {
      const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
      return vehicle || undefined;
    } catch (error) {
      console.error("Database error in getVehicle:", error);
      throw error;
    }
  }

  async createVehicle(vehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> {
    try {
      const [vehicle] = await db.insert(vehicles).values(vehicleData).returning();
      console.log("Vehicle created:", vehicle);
      return vehicle;
    } catch (error) {
      console.error("Database error in createVehicle:", error);
      throw error;
    }
  }

  async updateVehicle(id: number, vehicleData: Partial<Omit<Vehicle, 'id' | 'createdAt'>>): Promise<Vehicle | undefined> {
    try {
      const [vehicle] = await db.update(vehicles)
        .set(vehicleData)
        .where(eq(vehicles.id, id))
        .returning();
      return vehicle;
    } catch (error) {
      console.error("Database error in updateVehicle:", error);
      throw error;
    }
  }

  async deleteVehicle(id: number): Promise<void> {
    try {
      await db.delete(vehicles).where(eq(vehicles.id, id));
    } catch (error) {
      console.error("Database error in deleteVehicle:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();