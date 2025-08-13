import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type CalculationResult } from "@shared/schema";
import { Droplet, Leaf, RotateCcw } from "lucide-react";

interface ResultDisplayProps {
  result: CalculationResult;
  onNewCalculation: () => void;
}

export function ResultDisplay({ result, onNewCalculation }: ResultDisplayProps) {
  const isEtanol = result.bestFuel === 'etanol';

  return (
    <Card className="elevation-2" data-testid="result-card">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="text-4xl" data-testid="result-icon">
            {isEtanol ? (
              <Leaf className="text-secondary mx-auto" size={48} />
            ) : (
              <Droplet className="text-blue-500 mx-auto" size={48} />
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Recomendação</h3>
            <div 
              className={`text-2xl font-bold ${isEtanol ? 'text-secondary' : 'text-blue-500'}`}
              data-testid="text-recommendation"
            >
              {isEtanol ? 'Etanol' : 'Gasolina'}
            </div>
            <p className="text-sm text-gray-600 mt-1" data-testid="text-reason">
              {result.reason}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-700">Comparação de Custos</h4>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center">
                  <Droplet className="text-blue-500 mr-1" size={14} />
                  Gasolina (custo/km)
                </span>
                <span className="font-medium" data-testid="text-gasolina-cost">
                  R$ {result.gasolinaCostPerKm.toFixed(3)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 flex items-center">
                  <Leaf className="text-secondary mr-1" size={14} />
                  Etanol (custo/km)
                </span>
                <span className="font-medium" data-testid="text-etanol-cost">
                  R$ {result.etanolCostPerKm.toFixed(3)}
                </span>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Economia por tanque:</span>
                <span className="font-bold text-secondary" data-testid="text-savings">
                  R$ {result.savingsPerTank.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onNewCalculation}
            variant="outline"
            className="w-full py-3 font-medium"
            data-testid="button-new-calculation"
          >
            <RotateCcw className="mr-2" size={16} />
            Nova Consulta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
