import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogProduct } from '../stores/catalog.store';

// model do produto retornado pelo mongo do backend (vem com id e datas)
export interface ProductFromApi extends CatalogProduct {
  _id: string;
  userId: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  listar(): Observable<ProductFromApi[]> {
    return this.http.get<ProductFromApi[]>(`${this.apiUrl}/produtos`);
  }

  criar(produto: CatalogProduct): Observable<ProductFromApi> {
    return this.http.post<ProductFromApi>(`${this.apiUrl}/produtos`, produto);
  }
}