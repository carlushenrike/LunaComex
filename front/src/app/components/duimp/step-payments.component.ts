import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DuimpStore } from '../../stores/duimp.store';

@Component({
  selector: 'app-step-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-payments.component.html'
})
export class StepPaymentsComponent {
  store = inject(DuimpStore);

  updateField(field: string, value: any) {
    this.store.paymentData.update(current => ({ ...current, [field]: value }));
  }
}