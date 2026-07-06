import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DuimpStore, DuimpItem } from '../../stores/duimp.store';
import { IconComponent } from '../ui/icon.component';

@Component({
  selector: 'app-step-items',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './step-items.component.html'
})
export class StepItemsComponent {
  store = inject(DuimpStore);
  showModal = signal(false);
  modalTab = signal<'general' | 'tax'>('general');

  newItem: any = {
    ncm: '',
    description: '',
    quantity: 1,
    unitValue: 0,
    manufacturer: '',
    taxRegime: 'normal',
    exTariff: '',
    icmsReduction: false
  };

  openModal() {
    this.modalTab.set('general');
    this.newItem = {
      ncm: '',
      description: '',
      quantity: 1,
      unitValue: 0,
      manufacturer: this.store.docData().defaultExporter, // puxa o exportador padrao da store pra ja adiantar a digitacao
      taxRegime: 'normal',
      exTariff: '',
      icmsReduction: false
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveItem() {
    this.store.addItem({
      id: Date.now(),
      ncm: this.newItem.ncm || '0000.00.00',
      description: this.newItem.description || 'Item sem descrição',
      quantity: this.newItem.quantity,
      unitValue: this.newItem.unitValue,
      totalValue: this.newItem.quantity * this.newItem.unitValue,
      manufacturer: this.newItem.manufacturer,
      exTariff: this.newItem.exTariff,
      taxRegime: this.newItem.taxRegime,
      icmsReduction: this.newItem.icmsReduction
    });
    this.closeModal();
  }

  importXml() {
    // mockando leitura de xml/excel por enquanto para popular a lista rapido nos testes
    alert('Simulando leitura de XML/Excel...\n\nImportados 3 itens automaticamente!');
    const defaultMan = this.store.docData().defaultExporter;

    this.store.addItem({
      id: Date.now(),
      ncm: '8528.52.20',
      description: 'MONITOR LED 27 POL 4K UHD',
      quantity: 50,
      unitValue: 210.00,
      totalValue: 10500.00,
      manufacturer: defaultMan
    });
    this.store.addItem({
      id: Date.now() + 1,
      ncm: '8471.30.12',
      description: 'NOTEBOOK PRO 16GB RAM 512GB SSD',
      quantity: 10,
      unitValue: 1200.00,
      totalValue: 12000.00,
      manufacturer: defaultMan
    });
    this.store.addItem({
      id: Date.now() + 2,
      ncm: '8473.30.41',
      description: 'PLACA MAE GAMING Z590',
      quantity: 25,
      unitValue: 150.00,
      totalValue: 3750.00,
      manufacturer: defaultMan
    });
  }
}