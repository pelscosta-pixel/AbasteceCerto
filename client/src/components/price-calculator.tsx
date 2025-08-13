import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { priceInputSchema, type PriceInput, type VehicleData, type CalculationResult } from "@shared/schema";
import { Calculator, Droplet, Leaf, TrendingUp } from "lucide-react";

interface PriceCalculatorProps {
  vehicleData: VehicleData;
  onCalculate: (result: CalculationResult) => void;
}

export function PriceCalculator({ vehicleData, onCalculate }: PriceCalculatorProps) {
  const form = useForm<PriceInput>({
    resolver: zodResolver(priceInputSchema),
    defaultValues: {
      precoGasolina: 0,
      precoEtanol: 0,
    },
  });

  const calculateBestFuel = (prices: PriceInput): CalculationResult => {
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
  };

  const handleSubmit = (data: PriceInput) => {
    const result = calculateBestFuel(data);
    onCalculate(result);
  };

  return (
    <Card className="elevation-1" data-testid="price-calculator-card">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-6 text-center flex items-center justify-center">
          <Calculator className="text-primary mr-2" size={20} />
          Preços Atuais
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="precoGasolina"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Droplet className="text-blue-500 mr-1" size={16} />
                      Gasolina (R$/L)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="5.49"
                        step="0.01"
                        min="0.01"
                        max="20"
                        className="text-lg py-3 text-center"
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue = parseFloat(value) || 0;
                          field.onChange(numericValue);
                          // Update the display value to remove leading zeros
                          if (value && !isNaN(numericValue)) {
                            e.target.value = numericValue.toString();
                          }
                        }}
                        data-testid="input-preco-gasolina"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precoEtanol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Leaf className="text-secondary mr-1" size={16} />
                      Etanol (R$/L)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="3.89"
                        step="0.01"
                        min="0.01"
                        max="20"
                        className="text-lg py-3 text-center"
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue = parseFloat(value) || 0;
                          field.onChange(numericValue);
                          // Update the display value to remove leading zeros
                          if (value && !isNaN(numericValue)) {
                            e.target.value = numericValue.toString();
                          }
                        }}
                        data-testid="input-preco-etanol"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-lg elevation-1"
              data-testid="button-calculate"
            >
              <TrendingUp className="mr-2" size={16} />
              Calcular Melhor Opção
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}