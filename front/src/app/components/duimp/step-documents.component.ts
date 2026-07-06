import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { DuimpStore } from '../../stores/duimp.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-step-documents',
  standalone: true,
  imports: [FormsModule, IconComponent, DecimalPipe],
  templateUrl: './step-documents.component.html'
})
export class StepDocumentsComponent {
  store = inject(DuimpStore);

  updateField(field: string, value: any) {
    this.store.docData.update(current => ({ ...current, [field]: value }));
  }
}