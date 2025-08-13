import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleSetup } from "@/components/vehicle-setup";
import { PriceCalculator } from "@/components/price-calculator";
import { ResultDisplay } from "@/components/result-display";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type VehicleData, type CalculationResult } from "@shared/schema";
import { Car, Fuel, Settings, Plus, Edit } from "lucide-react";

type AppState = 'welcome' | 'setup' | 'calculator' | 'result';

export default function Home() {
  const [vehicleData, setVehicleData, removeVehicleData] = useLocalStorage<VehicleData | null>('vehicleData', null);
  const [appState, setAppState] = useState<AppState>(vehicleData ? 'calculator' : 'welcome');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const handleSaveVehicleData = (data: VehicleData) => {
    setVehicleData(data);
    setAppState('calculator');
  };

  const handleCalculationResult = (result: CalculationResult) => {
    setCalculationResult(result);
    setAppState('result');
  };

  const handleNewCalculation = () => {
    setAppState('calculator');
    setCalculationResult(null);
  };

  const handleEditVehicle = () => {
    setAppState('setup');
  };

  return (
    <div className="max-w-md mx-auto bg-surface min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white p-4 elevation-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Fuel size={24} />
            <h1 className="text-xl font-medium">Combustível Inteligente</h1>
          </div>
          {vehicleData && appState !== 'setup' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditVehicle}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors text-white"
              data-testid="button-settings"
            >
              <Settings size={18} />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Welcome Card */}
        {appState === 'welcome' && (
          <Card className="elevation-1 border-l-4 border-secondary" data-testid="welcome-card">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Car className="text-primary mx-auto" size={48} />
                <h2 className="text-lg font-medium text-gray-800">Bem-vindo!</h2>
                <p className="text-gray-600 text-sm">
                  Configure primeiro os dados do seu veículo para começar a calcular qual combustível vale mais a pena.
                </p>
                <Button
                  onClick={() => setAppState('setup')}
                  className="w-full py-3 font-medium elevation-1"
                  data-testid="button-setup"
                >
                  <Plus className="mr-2" size={16} />
                  Configurar Veículo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle Setup */}
        <VehicleSetup
          isVisible={appState === 'setup'}
          onClose={() => setAppState(vehicleData ? 'calculator' : 'welcome')}
          onSave={handleSaveVehicleData}
          initialData={vehicleData || undefined}
        />

        {/* Vehicle Info Card */}
        {vehicleData && appState !== 'setup' && (
          <Card className="elevation-1" data-testid="vehicle-info-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Car className="text-primary" size={18} />
                  <div>
                    <h3 className="font-medium text-gray-800">Seu Veículo</h3>
                    <p className="text-sm text-gray-600" data-testid="text-vehicle-info">
                      Gasolina: {vehicleData.gasolinaConsumo} km/l • Etanol: {vehicleData.etanolConsumo} km/l
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditVehicle}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                  data-testid="button-edit-vehicle"
                >
                  <Edit size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price Calculator */}
        {appState === 'calculator' && vehicleData && (
          <PriceCalculator
            vehicleData={vehicleData}
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
