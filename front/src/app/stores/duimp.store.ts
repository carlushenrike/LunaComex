import { Injectable, signal, computed } from '@angular/core';

export type Step = 'cover' | 'cargo' | 'docs' | 'items' | 'payments';

export interface DuimpItem {
  id: number;
  ncm: string;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  manufacturer?: string; // exportador/fabricante estrangeiro
  exTariff?: string; 
  taxRegime?: string; // ex: 'Normal', 'Suspensao'
  icmsReduction?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DuimpStore {
  currentStep = signal<number>(1);
  steps = [
    { id: 1, key: 'cover', label: 'Capa & ID', icon: 'file-text' },
    { id: 2, key: 'cargo', label: 'Carga & Transp.', icon: 'package' },
    { id: 3, key: 'docs', label: 'Docs & Moeda', icon: 'dollar-sign' },
    { id: 4, key: 'items', label: 'Itens (Produtos)', icon: 'list' },
    { id: 5, key: 'payments', label: 'Pagamentos', icon: 'credit-card' },
  ];

  status = signal<'Rascunho' | 'Validada' | 'Transmitida'>('Rascunho');

  coverData = signal({
    importerCnpj: '12.345.678/0001-90',
    importerName: 'ACME IMPORTS LTDA',
    importerType: 'juridica',
    declarationType: 'consumo',
    situation: 'normal',
    specialReason: ''
  });

  cargoData = signal({
    urfEntry: '0817600',
    urfDispatch: '0817600',
    transportMode: 'maritima', // maritima, aerea, rodoviaria
    transportDocNumber: '', // numero do CE Mercante ou AWB
    vehicleId: '',
    arrivalDate: ''
  });

  docData = signal({
    currency: 'USD',
    incoterm: '',
    freightValue: 0,
    insuranceValue: 0,
    ruc: '',
    defaultExporter: 'TIN-TIN ELECTRONICS LTD'
  });

  items = signal<DuimpItem[]>([]);

  paymentData = signal({
    bank: '',
    agency: '',
    account: '',
    centralizedIcms: false
  });

  totalItemsValue = computed(() => {
    return this.items().reduce((acc, item) => acc + item.totalValue, 0);
  });

  totalCustomsValue = computed(() => {
    // soma basica do valor aduaneiro: itens + frete + seguro
    return this.totalItemsValue() + this.docData().freightValue + this.docData().insuranceValue;
  });

  setStep(id: number) {
    this.currentStep.set(id);
  }

  nextStep() {
    if (this.currentStep() < 5) {
      this.currentStep.update(v => v + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(v => v - 1);
    }
  }

  addItem(item: DuimpItem) {
    this.items.update(items => [...items, item]);
  }

  removeItem(id: number) {
    this.items.update(items => items.filter(i => i.id !== id));
  }

  // gera a RUC padrão no padrão do siscomex
  generateRuc() {
    const ruc = '1BR' + Math.floor(Math.random() * 10000000000).toString().padStart(11, '0') + '9';
    this.docData.update(d => ({ ...d, ruc }));
  }
}