import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StockTalle {
  id?: number;
  producto_id?: number;
  numero_talle: number;
  stock: number;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string | number;
  categoria: string;
  imagen_url: string;
  talles: StockTalle[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProductos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.apiUrl}/productos`);
  }
}
