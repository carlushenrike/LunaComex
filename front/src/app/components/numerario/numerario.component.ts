import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStore } from '../../stores/app.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-numerario',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './numerario.component.html'
})
export class NumerarioComponent {
  store = inject(AppStore);

  totalPending = () => this.store.numerarioItems()
    .filter(i => i.status !== 'PAGO')
    .reduce((acc, i) => acc + i.valor, 0);
}
