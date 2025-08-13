import { z } from "zod";

export const vehicleDataSchema = z.object({
  gasolinaConsumo: z.number().min(1).max(50),
  etanolConsumo: z.number().min(1).max(50),
  capacidadeTanque: z.number().min(10).max(200),
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

export type VehicleData = z.infer<typeof vehicleDataSchema>;
export type PriceInput = z.infer<typeof priceInputSchema>;
export type CalculationResult = z.infer<typeof calculationResultSchema>;
