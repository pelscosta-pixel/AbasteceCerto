import { z } from "zod";
import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Database schema
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  gasolinaConsumo: real("gasolina_consumo").notNull(),
  etanolConsumo: real("etanol_consumo").notNull(),
  capacidadeTanque: real("capacidade_tanque").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const vehicleDataSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(50, "Nome muito longo"),
  gasolinaConsumo: z.number().min(1, "Mínimo 1 km/l").max(50, "Máximo 50 km/l"),
  etanolConsumo: z.number().min(1, "Mínimo 1 km/l").max(50, "Máximo 50 km/l"),
  capacidadeTanque: z.number().min(10, "Mínimo 10 litros").max(200, "Máximo 200 litros"),
});

export const priceInputSchema = z.object({
  precoGasolina: z.number().min(0.01).max(20),
  precoEtanol: z.number().min(0.01).max(20),
});

export const calculationResultSchema = z.object({
  bestFuel: z.enum(['gasolina', 'etanol']),
  gasolinaCostPerKm: z.number(),
  etanolCostPerKm: z.number(),
  savingsPerTank: z.number(),
  percentageDifference: z.number(),
  reason: z.string(),
});

// Insert and select types
export const insertVehicleSchema = createInsertSchema(vehicles).omit({ 
  id: true, 
  createdAt: true 
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type VehicleData = z.infer<typeof vehicleDataSchema>;
export type PriceInput = z.infer<typeof priceInputSchema>;
export type CalculationResult = z.infer<typeof calculationResultSchema>;
