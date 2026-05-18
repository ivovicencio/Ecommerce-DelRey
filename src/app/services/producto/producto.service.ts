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
    return this.http.get<ProductoResponse[]>(`${this.apiUrl}/productos`).pipe(
      catchError(err => {
        console.error('Error fetching productos:', err);
        return throwError(() => err);
      })
    );
  }

  createProducto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, formData).pipe(
      catchError(err => {
        console.error('Error creating producto:', err);
        return throwError(() => err);
      })
    );
  }
}
