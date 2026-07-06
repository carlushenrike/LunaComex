import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../stores/app.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-internal-finance',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './internal-finance.component.html'
})
export class InternalFinanceComponent {
  store = inject(AppStore);

  pendingExpenses = computed(() =>
    this.store.financialExpenses().filter(e => e.payer === 'DESPACHANTE' && e.status === 'SOLICITADO')
  );

  paidExpenses = computed(() =>
    this.store.financialExpenses().filter(e => e.payer === 'DESPACHANTE' && e.status === 'PAGO')
  );

  pendingCount = computed(() => this.pendingExpenses().length);

  totalApproved = computed(() =>
    this.paidExpenses().reduce((acc, curr) => acc + curr.value, 0)
  );

  approve(id: string) {
    if (confirm('Confirmar baixa e pagamento desta solicitação?')) {
      this.store.approveExpense(id);
    }
  }
}
