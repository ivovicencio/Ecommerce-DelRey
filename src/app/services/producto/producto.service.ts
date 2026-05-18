import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductoResponse } from '../../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProductos(): Observable<ProductoResponse[]> {
    return this.http.get<ProductoResponse[]>(`${this.apiUrl}/productos`);
  }

  getProducto(id: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/productos/${id}`);
  }

  createProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, formData);
  }

  updateProducto(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, formData);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }
}
