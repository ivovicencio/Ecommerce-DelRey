import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMsg = signal('');
  loading = signal(false);

  registrarse() {
    if (!this.nombre || !this.email || !this.password) {
      this.errorMsg.set('Completá todos los campos.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMsg.set('Las contraseñas no coinciden.');
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    this.errorMsg.set('');
    this.loading.set(true);

    this.auth.register({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.msg || 'Error al registrarse.');
      }
    });
  }
}
