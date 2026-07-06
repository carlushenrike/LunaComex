import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DuimpStore } from '../../stores/duimp.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-step-cargo',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './step-cargo.component.html'
})
export class StepCargoComponent {
  store = inject(DuimpStore);

  docLabel = computed(() => {
    switch (this.store.cargoData().transportMode) {
      case 'maritima': return 'CE Mercante';
      case 'aerea': return 'AWB / MAWB';
      case 'rodoviaria': return 'CRT / MIC-DTA';
      default: return 'Conhecimento de Carga';
    }
  });

  docPlaceholder = computed(() => {
    switch (this.store.cargoData().transportMode) {
      case 'maritima': return 'Ex: 123456789012345';
      case 'aerea': return 'Ex: 001-12345678';
      default: return '';
    }
  });

  updateField(field: string, value: any) {
    this.store.cargoData.update(current => ({ ...current, [field]: value }));
  }
}