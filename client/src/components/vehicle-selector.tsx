import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Vehicle } from "@shared/schema";
import { Car, Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VehicleSelectorProps {
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle | null) => void;
  onAddVehicle: () => void;
  onEditVehicle: (vehicle: Vehicle) => void;
}

export function VehicleSelector({ 
  selectedVehicle, 
  onVehicleSelect, 
  onAddVehicle, 
  onEditVehicle 
}: VehicleSelectorProps) {
  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['/api/vehicles'],
    queryFn: async (): Promise<Vehicle[]> => {
      const response = await fetch('/api/vehicles');
      if (!response.ok) throw new Error('Failed to fetch vehicles');
      return response.json();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (vehicleId: number) => {
      const response = await fetch('/api/vehicles/' + vehicleId, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete vehicle');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vehicles'] });
      onVehicleSelect(null);
    }
  });

  const handleVehicleChange = (vehicleId: string) => {
    if (vehicleId === "add-new") {
      onAddVehicle();
      return;
    }
    
    const vehicle = vehicles.find(v => v.id.toString() === vehicleId) || null;
    onVehicleSelect(vehicle);
  };

  const handleDelete = (vehicle: Vehicle) => {
    if (confirm(`Deseja realmente excluir o veículo "${vehicle.nome}"?`)) {
      deleteMutation.mutate(vehicle.id);
    }
  };

  if (isLoading) {
    return (
      <Card className="elevation-1" data-testid="vehicle-selector-loading">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">Carregando veículos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="elevation-1" data-testid="vehicle-selector-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-800 flex items-center">
            <Car className="text-primary mr-2" size={18} />
            Selecionar Veículo
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddVehicle}
            className="p-2 text-primary hover:text-primary/80 transition-colors"
            data-testid="button-add-vehicle"
          >
            <Plus size={16} />
          </Button>
        </div>

        <div className="space-y-3">
          <Select 
            value={selectedVehicle?.id.toString() || ""} 
            onValueChange={handleVehicleChange}
          >
            <SelectTrigger className="text-lg py-3" data-testid="select-vehicle">
              <SelectValue placeholder="Escolha um veículo..." />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                  {vehicle.nome}
                </SelectItem>
              ))}
              <SelectItem value="add-new" className="text-primary font-medium">
                <Plus className="inline mr-2" size={16} />
                Adicionar novo veículo
              </SelectItem>
            </SelectContent>
          </Select>

          {selectedVehicle && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800" data-testid="text-selected-vehicle-name">
                    {selectedVehicle.nome}
                  </h4>
                  <p className="text-sm text-gray-600" data-testid="text-selected-vehicle-info">
                    Gasolina: {selectedVehicle.gasolinaConsumo} km/l • Etanol: {selectedVehicle.etanolConsumo} km/l
                  </p>
                  <p className="text-sm text-gray-600">
                    Tanque: {selectedVehicle.capacidadeTanque}L
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditVehicle(selectedVehicle)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                    data-testid="button-edit-selected-vehicle"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(selectedVehicle)}
                    className="p-2 text-gray-400 hover:text-destructive transition-colors"
                    data-testid="button-delete-selected-vehicle"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}