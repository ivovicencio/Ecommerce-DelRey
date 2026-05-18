import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DetallePedidoRequest {
  producto_id: number;
  talle: number;
  cantidad: number;
  precio_unitario: number;
}

export interface CreatePedidoResponse {
  status: string;
  codigo: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createPedido(total: number, items: DetallePedidoRequest[]): Observable<CreatePedidoResponse> {
    return this.http.post<CreatePedidoResponse>(`${this.apiUrl}/pedidos`, { total, items });
  }
}
