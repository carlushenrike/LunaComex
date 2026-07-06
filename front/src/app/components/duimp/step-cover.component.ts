import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DuimpStore } from '../../stores/duimp.store';

@Component({
  selector: 'app-step-cover',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './step-cover.component.html'
})
export class StepCoverComponent {
  store = inject(DuimpStore);

  updateField(field: string, value: any) {
    this.store.coverData.update(current => ({ ...current, [field]: value }));
  }
}