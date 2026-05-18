import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginData, RegisterData, Usuario } from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private tokenKey = 'delrey_token';
  private usuarioKey = 'delrey_usuario';

  private usuarioSignal = signal<Usuario | null>(this.cargarUsuario());

  usuario = computed(() => this.usuarioSignal());
  isLoggedIn = computed(() => this.usuarioSignal() !== null);
  isAdmin = computed(() => this.usuarioSignal()?.rol === 'admin');

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(resp => this.guardarSesion(resp.token, resp.usuario))
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(resp => this.guardarSesion(resp.token, resp.usuario))
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.usuarioSignal.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private guardarSesion(token: string, usuario: Usuario) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
    this.usuarioSignal.set(usuario);
  }

  private cargarUsuario(): Usuario | null {
    const data = localStorage.getItem(this.usuarioKey);
    return data ? JSON.parse(data) : null;
  }
}
