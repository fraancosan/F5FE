export type PolicyInputType = 'time' | 'currency' | 'percentage' | 'number' | 'text';

export interface PolicyMetadata {
  label: string;
  type: PolicyInputType;
  placeholder: string;
}

export const FIXED_POLICIES_CONFIG: Record<string, PolicyMetadata> = {
  horaAbre: { label: 'Hora de apertura', type: 'time', placeholder: 'HH:mm' },
  horaCierra: { label: 'Hora de cierre', type: 'time', placeholder: 'HH:mm' },
  descuentoPremium: { label: 'Descuento para usuarios premium', type: 'percentage', placeholder: 'Ej: 20' },
  porcentajeSeña: { label: 'Porcentaje de seña', type: 'percentage', placeholder: 'Ej: 50' },
  precioTurno: { label: 'Precio del turno', type: 'currency', placeholder: 'Ej: 15000' },
  precioParrilla: { label: 'Precio de parrilla', type: 'currency', placeholder: 'Ej: 5000' },
  reservasNecesariasPremium: { label: 'Reservas necesarias para premium', type: 'number', placeholder: 'Ej: 3' },
};