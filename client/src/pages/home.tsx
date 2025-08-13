import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleSetup } from "@/components/vehicle-setup";
import { VehicleSelector } from "@/components/vehicle-selector";
import { PriceCalculator } from "@/components/price-calculator";
import { ResultDisplay } from "@/components/result-display";
import { type Vehicle, type VehicleData, type CalculationResult } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Car, Fuel, Plus, Edit } from "lucide-react";

type AppState = 'welcome' | 'setup' | 'calculator' | 'result';

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [appState, setAppState] = useState<AppState>('welcome');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: VehicleData) => {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create vehicle');
      return response.json();
    },
    onSuccess: (newVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      setSelectedVehicle(newVehicle);
      setAppState('calculator');
      toast({ title: "Veículo criado com sucesso!" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: VehicleData }) => {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update vehicle');
      return response.json();
    },
    onSuccess: (updatedVehicle) => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      setSelectedVehicle(updatedVehicle);
      setEditingVehicle(null);
      setAppState('calculator');
      toast({ title: "Veículo atualizado com sucesso!" });
    }
  });

  const handleSaveVehicleData = (data: VehicleData) => {
    if (editingVehicle) {
      updateMutation.mutate({ id: editingVehicle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleCalculationResult = (result: CalculationResult) => {
    setCalculationResult(result);
    setAppState('result');
  };

  const handleNewCalculation = () => {
    setAppState('calculator');
    setCalculationResult(null);
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setAppState('setup');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setAppState('setup');
  };

  const handleVehicleSelect = (vehicle: Vehicle | null) => {
    setSelectedVehicle(vehicle);
    if (vehicle) {
      setAppState('calculator');
    } else {
      setAppState('welcome');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-surface min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white p-4 elevation-2">
        <div className="flex items-center space-x-3">
          <Fuel size={24} />
          <h1 className="text-xl font-medium">Combustível Inteligente</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Vehicle Selector */}
        {appState === 'welcome' && (
          <Card className="elevation-1 border-l-4 border-secondary" data-testid="welcome-card">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Car className="text-primary mx-auto" size={48} />
                <h2 className="text-lg font-medium text-gray-800">Bem-vindo!</h2>
                <p className="text-gray-600 text-sm">
                  Selecione ou adicione um veículo para começar a calcular qual combustível vale mais a pena.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {(appState === 'welcome' || appState === 'calculator') && (
          <VehicleSelector
            selectedVehicle={selectedVehicle}
            onVehicleSelect={handleVehicleSelect}
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
          />
        )}

        {/* Vehicle Setup */}
        <VehicleSetup
          isVisible={appState === 'setup'}
          onClose={() => setAppState(selectedVehicle ? 'calculator' : 'welcome')}
          onSave={handleSaveVehicleData}
          initialData={editingVehicle || undefined}
          isEditing={!!editingVehicle}
        />

        {/* Price Calculator */}
        {appState === 'calculator' && selectedVehicle && (
          <PriceCalculator
            vehicleData={{
              nome: selectedVehicle.nome,
              gasolinaConsumo: selectedVehicle.gasolinaConsumo,
              etanolConsumo: selectedVehicle.etanolConsumo,
              capacidadeTanque: selectedVehicle.capacidadeTanque
            }}
            onCalculate={handleCalculationResult}
          />
        )}

        {/* Result Display */}
        {appState === 'result' && calculationResult && (
          <ResultDisplay
            result={calculationResult}
            onNewCalculation={handleNewCalculation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-500 border-t">
        <p>💡 Dica: Etanol geralmente vale a pena quando custa até 70% do preço da gasolina</p>
      </footer>
    </div>
  );
}
