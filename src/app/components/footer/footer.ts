import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  nombre = '';
  mensaje = '';
  enviado = false;
  error = '';

  enviarResena() {
    if (!this.nombre.trim() || !this.mensaje.trim()) return;

    this.http.post<{ status: string; msg: string }>(`${this.apiUrl}/contacto/resenas`, {
      nombre: this.nombre.trim(),
      mensaje: this.mensaje.trim()
    }).subscribe({
      next: () => {
        this.enviado = true;
        this.error = '';
        this.nombre = '';
        this.mensaje = '';
        setTimeout(() => this.enviado = false, 5000);
      },
      error: (err) => {
        this.error = err.error?.msg || 'Error al enviar la reseña.';
      }
    });
  }
}
