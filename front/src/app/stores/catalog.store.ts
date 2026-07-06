import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ProductAttribute {
  codigoAtributo: string;
  nome: string; 
  valor: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
}

export interface Operator {
  id: string;
  nome: string;
  pais: string;
  tin: string;
  email?: string; 
  logradouro: string;
  cidade: string;
  subdivisao?: string;
  cep?: string;
  codigoInt?: string;
}

export interface CatalogProduct {
  id?: string;
  userId?: string; 
  companyId: string;
  cpfCnpjRaiz: string;
  codigo: string; 
  versao: string;
  ncm: string;
  denominacao: string; 
  detalhamentoComplementar: string;
  modalidade: 'IMPORTACAO' | 'EXPORTACAO' | 'AMBAS';
  situacao: 'ATIVO' | 'INATIVO' | 'RASCUNHO' | 'NAO_PUBLICADO'; 
  atributos: ProductAttribute[];
  fabricante: {
    tipo: 'CONHECIDO' | 'DESCONHECIDO';
    dados?: Operator;
  };
  operadorEstrangeiro?: Operator;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogStore {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  companies = signal<Company[]>([
    { id: '1', name: 'CARLOS LUNACOMEX DEV', cnpj: '078.653.393-56' },
    { id: '2', name: 'ACME IMPORTS LTDA MOCK', cnpj: '12.345.678/0001-90' },
    { id: '3', name: 'GLOBAL TRADE S.A. MOCK', cnpj: '98.765.432/0001-15' }
  ]);

  currentCompanyId = signal<string>('1');

  operators = signal<Operator[]>([
    { 
      id: '1', 
      nome: 'SAMSUNG ELECTRONICS CO LTD', 
      pais: 'KR', 
      tin: 'KR-123456789', 
      logradouro: '129 Samsung-ro, Yeongtong-gu', 
      cidade: 'Suwon-si', 
      subdivisao: 'Gyeonggi-do', 
      codigoInt: 'FORN_001' 
    },
    { 
      id: '2', 
      nome: 'DELL GLOBAL B.V.', 
      pais: 'US', 
      tin: 'US-987654321', 
      logradouro: 'One Dell Way', 
      cidade: 'Round Rock', 
      subdivisao: 'TX', 
      codigoInt: 'FORN_002' 
    },
    { 
      id: '3', 
      nome: 'SHENZHEN TECH LTD', 
      pais: 'CN', 
      tin: 'CN-555555555', 
      logradouro: 'No. 888 Industrial Park', 
      cidade: 'Shenzhen', 
      subdivisao: 'Guangdong', 
      codigoInt: 'FORN_003' 
    }
  ]);

  products = signal<CatalogProduct[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ncmList = [
    { code: '8528.52.20', desc: 'Monitores com video' },
    { code: '8471.30.12', desc: 'Máquinas automáticas de processamento de dados' },
    { code: '8473.30.41', desc: 'Placas-mãe' },
    { code: '8708.70.90', desc: 'Rodas e suas partes (Sem atributos obrigatórios)' },
    { code: '7318.15.00', desc: 'Parafusos (Sem atributos obrigatórios)' }
  ];

  setCompany(id: string) {
    this.currentCompanyId.set(id);
  }

  loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<CatalogProduct[]>(`${this.apiUrl}/produtos`).subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.error.set('Erro ao carregar produtos do servidor');
        this.loading.set(false);
      }
    });
  }

  addProduct(product: CatalogProduct) {
    if (product.id) {
      this.http.put<CatalogProduct>(`${this.apiUrl}/produtos/${product.id}`, product).subscribe({
        next: (updated) => {
          this.products.update(list => list.map(p => p.id === updated.id ? updated : p));
        },
        error: (err) => {
          console.error('Erro ao atualizar produto:', err);
          this.error.set('Erro ao atualizar produto');
        }
      });
    } else {
      this.http.post<CatalogProduct>(`${this.apiUrl}/produtos`, product).subscribe({
        next: (saved) => {
          this.products.update(list => [saved, ...list]);
        },
        error: (err) => {
          console.error('Erro ao salvar produto:', err);
          this.error.set('Erro ao salvar produto');
        }
      });
    }
  }

  updateProduct(updated: CatalogProduct) {
    this.products.update(list =>
      list.map(p => p.codigo === updated.codigo && p.companyId === updated.companyId ? updated : p)
    );
  }

  addOperator(op: Operator) {
    this.operators.update(list => [...list, op]);
  }
}
