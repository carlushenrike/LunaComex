import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStore, FinancialExpense } from '../../stores/app.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './financial.component.html'
})
export class FinancialComponent {
  store = inject(AppStore);
  tempAdvance = 0;

  commonExpenses = [
    'Armazenagem',
    'Frete Interno',
    'Capatazia (THC)',
    'SDA (Sindicato)',
    'Honorários Despachante',
    'Transporte Rodoviário',
    'Reembalagem / Etiquetagem',
    'Taxa Siscomex',
    'ICMS Complementar',
    'Despesas Bancárias'
  ];

  newExpense: FinancialExpense = {
    id: '',
    description: '',
    value: 0,
    payer: 'CLIENTE',
    status: 'PENDENTE'
  };

  constructor() {
    this.tempAdvance = this.store.financialAdvances();
  }

  addExpense() {
    if (!this.newExpense.description || this.newExpense.value <= 0) return;

    // se for o despachante pagando, a gente pede reembolso (solicitado). se for cliente, ja debita direto (pago)
    const initialStatus = this.newExpense.payer === 'DESPACHANTE' ? 'SOLICITADO' : 'PAGO';

    this.store.addExpense({
      ...this.newExpense,
      id: Date.now().toString(),
      status: initialStatus
    });

    this.newExpense = {
      id: '',
      description: '',
      value: 0,
      payer: this.newExpense.payer,
      status: 'PENDENTE'
    };
  }
}
