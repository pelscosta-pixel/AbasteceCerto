import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { vehicleDataSchema, type VehicleData, type Vehicle } from "@shared/schema";
import { Car, Gauge, Leaf, Fuel, X, Save } from "lucide-react";
import { useEffect } from "react";

interface VehicleSetupProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (data: VehicleData) => void;
  initialData?: Vehicle;
  isEditing?: boolean;
}

export function VehicleSetup({ isVisible, onClose, onSave, initialData, isEditing }: VehicleSetupProps) {
  const form = useForm<VehicleData>({
    resolver: zodResolver(vehicleDataSchema),
    defaultValues: {
      nome: "",
      gasolinaConsumo: 0,
      etanolConsumo: 0,
      capacidadeTanque: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        nome: initialData.nome,
        gasolinaConsumo: initialData.gasolinaConsumo,
        etanolConsumo: initialData.etanolConsumo,
        capacidadeTanque: initialData.capacidadeTanque,
      });
    } else {
      form.reset({
        nome: "",
        gasolinaConsumo: 0,
        etanolConsumo: 0,
        capacidadeTanque: 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: VehicleData) => {
    onSave(data);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Card className="elevation-2" data-testid="vehicle-setup-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <Car className="text-primary mr-2" size={20} />
            {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
            data-testid="button-close-setup"
          >
            <X size={16} />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Car className="text-primary mr-1" size={16} />
                    Nome do Veículo
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Ex: Honda Civic 2020"
                      className="text-lg py-3"
                      data-testid="input-nome-veiculo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gasolinaConsumo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Gauge className="text-primary mr-1" size={16} />
                    Consumo com Gasolina (km/l)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Ex: 12.5"
                      step="0.1"
                      min="1"
                      max="50"
                      className="text-lg py-3"
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = parseFloat(value) || 0;
                        field.onChange(numericValue);
                        // Update the display value to remove leading zeros
                        if (value && !isNaN(numericValue)) {
                          e.target.value = numericValue.toString();
                        }
                      }}
                      data-testid="input-gasolina-consumo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="etanolConsumo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Leaf className="text-secondary mr-1" size={16} />
                    Consumo com Etanol (km/l)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Ex: 8.9"
                      step="0.1"
                      min="1"
                      max="50"
                      className="text-lg py-3"
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = parseFloat(value) || 0;
                        field.onChange(numericValue);
                        // Update the display value to remove leading zeros
                        if (value && !isNaN(numericValue)) {
                          e.target.value = numericValue.toString();
                        }
                      }}
                      data-testid="input-etanol-consumo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacidadeTanque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <Fuel className="text-accent mr-1" size={16} />
                    Capacidade do Tanque (litros)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Ex: 50"
                      step="1"
                      min="10"
                      max="200"
                      className="text-lg py-3"
                      onChange={(e) => {
                        const value = e.target.value;
                        const numericValue = parseFloat(value) || 0;
                        field.onChange(numericValue);
                        // Update the display value to remove leading zeros
                        if (value && !isNaN(numericValue)) {
                          e.target.value = numericValue.toString();
                        }
                      }}
                      data-testid="input-capacidade-tanque"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 text-lg elevation-1"
              data-testid="button-save-vehicle"
            >
              <Save className="mr-2" size={16} />
              Salvar Configurações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
