import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto/producto.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin {
  private productService = inject(ProductoService);

  nombre = '';
  descripcion = '';
  precio: number | null = null;
  categoria = 'masculino';
  imagenFile: File | null = null;
  imagenPreview = signal<string | null>(null);
  talles = signal<{ talle: number; stock: number }[]>([]);
  enviando = signal(false);
  exito = signal(false);
  errorMsg = signal('');

  agregarTalle() {
    this.talles.update(t => [...t, { talle: 0, stock: 0 }]);
  }

  quitarTalle(index: number) {
    this.talles.update(t => t.filter((_, i) => i !== index));
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.imagenFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagenPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  guardarProducto() {
    this.errorMsg.set('');

    if (!this.nombre?.trim()) { this.errorMsg.set('El nombre del producto es obligatorio.'); return; }
    if (!this.descripcion?.trim()) { this.errorMsg.set('La descripción es obligatoria.'); return; }
    if (!this.precio || this.precio <= 0) { this.errorMsg.set('El precio debe ser mayor a 0.'); return; }
    if (!this.imagenFile) { this.errorMsg.set('Seleccioná una imagen para el producto.'); return; }

    const tallesValidos = this.talles().filter(t => t.talle > 0 && t.stock > 0);
    if (tallesValidos.length === 0) {
      this.errorMsg.set('Agregá al menos un talle con stock mayor a 0.');
      return;
    }

    this.enviando.set(true);

    const formData = new FormData();
    formData.append('nombre', this.nombre.trim());
    formData.append('descripcion', this.descripcion.trim());
    formData.append('precio', String(this.precio));
    formData.append('categoria', this.categoria);
    formData.append('imagen', this.imagenFile);
    formData.append('talles', JSON.stringify(
      tallesValidos.map(t => ({ numero_talle: Number(t.talle), stock: Number(t.stock) }))
    ));

    this.productService.createProducto(formData).subscribe({
      next: () => {
        this.enviando.set(false);
        this.exito.set(true);
        this.nombre = '';
        this.descripcion = '';
        this.precio = null;
        this.categoria = 'masculino';
        this.imagenFile = null;
        this.imagenPreview.set(null);
        this.talles.set([]);
        setTimeout(() => this.exito.set(false), 4000);
      },
      error: (err) => {
        this.enviando.set(false);
        const serverMsg = err?.error?.details || err?.error?.msg || err?.message || '';
        this.errorMsg.set(serverMsg ? `Error: ${serverMsg}` : 'Error al guardar el producto. Revisá la consola.');
      }
    });
  }
}
