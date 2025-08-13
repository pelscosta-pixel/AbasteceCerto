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
    return db.select().from(vehicles).orderBy(vehicles.createdAt);
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db
      .insert(vehicles)
      .values(insertVehicle)
      .returning();
    return vehicle;
  }

  async updateVehicle(id: number, insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db
      .update(vehicles)
      .set(insertVehicle)
      .where(eq(vehicles.id, id))
      .returning();
    return vehicle;
  }

  async deleteVehicle(id: number): Promise<void> {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }
}

export const storage = new DatabaseStorage();
