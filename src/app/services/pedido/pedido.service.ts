import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pedido, ResumenPedidos } from '../../interfaces/pedido.interface';

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

  createPedido(total: number, items: DetallePedidoRequest[], cliente_nombre: string, cliente_direccion: string): Observable<CreatePedidoResponse> {
    return this.http.post<CreatePedidoResponse>(`${this.apiUrl}/pedidos`, { total, items, cliente_nombre, cliente_direccion });
  }

  getPedidos(estado?: string): Observable<Pedido[]> {
    const params = estado && estado !== 'todos' ? `?estado=${estado}` : '';
    return this.http.get<Pedido[]>(`${this.apiUrl}/pedidos${params}`);
  }

  getPedido(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/pedidos/${id}`);
  }

  confirmarPedido(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${id}/confirmar`, {});
  }

  cancelarPedido(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${id}/cancelar`, {});
  }

  getResumen(): Observable<ResumenPedidos> {
    return this.http.get<ResumenPedidos>(`${this.apiUrl}/pedidos/resumen`);
  }
}
