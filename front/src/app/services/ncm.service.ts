import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RetornoNcm } from '../models/ncm-attributes.model';

@Injectable({ providedIn: 'root' })
export class NcmService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  buscarAtributos(ncm: string): Observable<RetornoNcm> {
    // limpa os pontos do ncm pra mandar pro back
    const ncmLimpa = ncm.replace(/\./g, '');
    return this.http.get<RetornoNcm>(`${this.apiUrl}/ncm/${ncmLimpa}/atributos`);
  }
}