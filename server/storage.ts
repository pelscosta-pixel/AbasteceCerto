import { type VehicleData, type PriceInput, type CalculationResult } from "@shared/schema";

// Storage interface for fuel calculator app
export interface IStorage {
  // For now, we'll use localStorage on frontend for persistence
  // This interface is kept minimal for potential future expansion
  calculateFuel(vehicleData: VehicleData, prices: PriceInput): CalculationResult;
}

export class MemStorage implements IStorage {
  constructor() {
    // No persistent storage needed for calculations
  }

  calculateFuel(vehicleData: VehicleData, prices: PriceInput): CalculationResult {
    const gasolinaCostPerKm = prices.precoGasolina / vehicleData.gasolinaConsumo;
    const etanolCostPerKm = prices.precoEtanol / vehicleData.etanolConsumo;
    
    const bestFuel = etanolCostPerKm < gasolinaCostPerKm ? 'etanol' : 'gasolina';
    const savingsPerKm = Math.abs(gasolinaCostPerKm - etanolCostPerKm);
    
    // Calculate savings per full tank based on average consumption
    const avgConsumption = bestFuel === 'etanol' ? vehicleData.etanolConsumo : vehicleData.gasolinaConsumo;
    const kmPerTank = vehicleData.capacidadeTanque * avgConsumption;
    const savingsPerTank = savingsPerKm * kmPerTank;
    
    const maxCost = Math.max(gasolinaCostPerKm, etanolCostPerKm);
    const minCost = Math.min(gasolinaCostPerKm, etanolCostPerKm);
    const percentageDifference = ((maxCost - minCost) / maxCost) * 100;
    
    return {
      bestFuel,
      gasolinaCostPerKm,
      etanolCostPerKm,
      savingsPerTank,
      percentageDifference,
      reason: `${percentageDifference.toFixed(1)}% mais econômico`
    };
  }
}

export const storage = new MemStorage();
