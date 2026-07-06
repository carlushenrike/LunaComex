import { Injectable, signal, computed } from '@angular/core';

export type Page = 'dashboard' | 'duimp' | 'catalog' | 'lpco' | 'tracking' | 'numerario' | 'financial' | 'invoice' | 'closing' | 'internal-finance';

export interface Lpco {
  numero: string;
  orgao: string;
  modelo: string;
  situacao: 'DEFERIDO' | 'EM EXIGENCIA' | 'PARA ANALISE' | 'CANCELADO';
  dataFimVigencia: string;
  saldo?: string;
}

export interface CctEvent {
  data: string;
  descricao: string;
  local: string;
}

export interface CctTracking {
  numeroId: string;
  localizacao: {
    unidade: string;
    recinto: string;
  };
  pesoBruto: number;
  eventos: CctEvent[];
}

export interface PaymentItem {
  id: string;
  descricao: string;
  tipo: 'TAXA_LPCO' | 'IMPOSTO_FEDERAL' | 'ICMS';
  valor: number;
  vencimento: string;
  status: 'PENDENTE' | 'PAGO' | 'AGENDADO';
  codigoBarras?: string;
}

export interface FinancialExpense {
  id: string;
  description: string;
  value: number;
  payer: 'CLIENTE' | 'DESPACHANTE';
  status: 'PAGO' | 'PENDENTE' | 'SOLICITADO';
}

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  currentPage = signal<Page>('dashboard');
  
  menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'pie-chart' },
    { id: 'duimp', label: 'Nova DUIMP', icon: 'file-text' },
    { id: 'catalog', label: 'Catálogo de Produtos', icon: 'grid' },
    { id: 'lpco', label: 'Licenças (LPCO)', icon: 'check-circle' },
    { id: 'tracking', label: 'Rastreamento (CCT)', icon: 'map-pin' },
    { id: 'numerario', label: 'Numerário', icon: 'dollar-sign' },
    { id: 'financial', label: 'Financeiro', icon: 'credit-card' },
    { id: 'internal-finance', label: 'Financeiro Interno', icon: 'wallet' },
    { id: 'invoice', label: 'Espelho NF', icon: 'clipboard' },
    { id: 'closing', label: 'Fechamento', icon: 'archive' }
  ];

  dashboardStats = signal({
    duimpStatus: [
      { label: 'Em Elaboração', count: 3, color: 'text-slate-600' },
      { label: 'Registrada', count: 12, color: 'text-blue-600' },
      { label: 'Desembaraçada', count: 45, color: 'text-emerald-600' }
    ],
    lpcoAlerts: 2,
    cargasZonaPrimaria: 5
  });

  lpcoList = signal<Lpco[]>([
    { numero: 'I2400001234', orgao: 'ANVISA', modelo: 'Licença de Importação (Medicamentos)', situacao: 'DEFERIDO', dataFimVigencia: '2024-12-31', saldo: '10000 UN' },
    { numero: 'I2400005678', orgao: 'MAPA', modelo: 'Certificado Fitossanitário', situacao: 'EM EXIGENCIA', dataFimVigencia: '2024-10-15' },
    { numero: 'I2400009012', orgao: 'DECEX', modelo: 'Licença Automática', situacao: 'PARA ANALISE', dataFimVigencia: '2025-01-20' }
  ]);

  trackingData = signal<CctTracking | null>(null);

  numerarioItems = signal<PaymentItem[]>([
    { id: 'TAX-001', descricao: 'Taxa Anvisa - LI I2400001234', tipo: 'TAXA_LPCO', valor: 890.50, vencimento: '2024-05-20', status: 'PENDENTE', codigoBarras: '890000000...' },
    { id: 'IMP-FED', descricao: 'II + IPI + PIS + COFINS (DUIMP 24/00500)', tipo: 'IMPOSTO_FEDERAL', valor: 45200.00, vencimento: '2024-05-21', status: 'AGENDADO' },
    { id: 'ICMS-SP', descricao: 'ICMS Importação - SP', tipo: 'ICMS', valor: 12500.00, vencimento: '2024-05-21', status: 'PENDENTE', codigoBarras: '123123123...' }
  ]);

  financialProcess = signal({
    duimp: '23BR000123456',
    ref: 'IMP-2024/099',
    importer: 'MINHA EMPRESA IMPORTADORA'
  });

  financialExpenses = signal<FinancialExpense[]>([]);

  financialAdvances = signal<number>(0);
  financialTaxes = signal<number>(0);

  totalBrokerExpenses = computed(() => 
    this.financialExpenses()
      .filter(e => e.payer === 'DESPACHANTE')
      .reduce((sum, e) => sum + e.value, 0)
  );

  totalClientExpenses = computed(() => 
    this.financialExpenses()
      .filter(e => e.payer === 'CLIENTE')
      .reduce((sum, e) => sum + e.value, 0)
  );

  brokerBalance = computed(() => 
    this.financialAdvances() - this.totalBrokerExpenses()
  );

  totalClientDebit = computed(() => 
    this.financialTaxes() + this.totalClientExpenses()
  );

  totalImportCost = computed(() => 
    this.totalBrokerExpenses() + this.totalClientDebit()
  );

  setPage(page: string) {
    this.currentPage.set(page as Page);
  }

  searchCarga(term: string) {
    this.trackingData.set({
      numeroId: term.toUpperCase(),
      localizacao: { unidade: '0817600 - ALF. SANTOS', recinto: '8931401 - SANTOS BRASIL' },
      pesoBruto: 12450.50,
      eventos: [
        { data: '2024-05-15 14:30', descricao: 'Entrega de Carga', local: 'SANTOS BRASIL' },
        { data: '2024-05-14 08:00', descricao: 'Desembaraço Aduaneiro', local: 'ALF. SANTOS' },
        { data: '2024-05-12 10:15', descricao: 'Recepção de Carga', local: 'SANTOS BRASIL' },
        { data: '2024-05-10 22:00', descricao: 'Manifestação de Carga', local: 'SISTEMA CCT' }
      ]
    });
  }

  addExpense(expense: FinancialExpense) {
    this.financialExpenses.update(list => [...list, expense]);
  }

  removeExpense(id: string) {
    this.financialExpenses.update(list => list.filter(e => e.id !== id));
  }

  approveExpense(id: string) {
    this.financialExpenses.update(list => list.map(e => 
      e.id === id ? { ...e, status: 'PAGO' } : e
    ));
  }
}