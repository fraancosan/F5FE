import { Component, Input } from '@angular/core';
import { politica } from '../../../../Interfases/interfaces';

@Component({
  selector: 'app-card-politicas',
  imports: [],
  templateUrl: './card-politicas.html',
  styleUrl: './card-politicas.css'
})
export class CardPoliticas {
  @Input() politica: politica = {} as politica;

  private readonly policyLabels: Record<string, string> = {
    horaAbre: 'Hora de apertura',
    horaCierra: 'Hora de cierre',
    descuentoPremium: 'Descuento para usuarios premium',
    reservasNecesariasPremium: 'Reservas necesarias para premium',
    precioTurno: 'Precio del turno',
    porcentajeSeña: 'Porcentaje de seña',
    precioParrilla: 'Precio de parrilla'
  };

  get displayName(): string {
    const key = (this.politica?.nombre ?? '').trim();
    if (!key) return '';
    return this.policyLabels[key] ?? this.prettifyUnknownName(key);
  }

  get displayValue(): string {
    const key = (this.politica?.nombre ?? '').trim();
    const raw = String(this.politica?.descripcion ?? '').trim();

    if (!raw) return '-';

    if (key === 'descuentoPremium' || key === 'porcentajeSeña') {
      const normalized = raw.replace(',', '.');
      const n = Number(normalized);
      if (!Number.isFinite(n)) return raw;

      // Backward compatibility: old values may be stored as fraction (0.2 = 20%).
      const percentage = n <= 1 ? n * 100 : n;
      return percentage.toLocaleString('es-AR', { maximumFractionDigits: 2 }) + '%';
    }

    if (key === 'precioTurno' || key === 'precioParrilla') {
      const n = Number(raw);
      if (!Number.isFinite(n)) return raw;
      return '$ ' + n.toLocaleString('es-AR');
    }

    return raw;
  }

  private prettifyUnknownName(name: string): string {
    const withSpaces = name.replace(/([A-Z])/g, ' $1').trim();
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }
}
