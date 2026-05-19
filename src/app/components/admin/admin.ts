import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto/producto.service';
import { ProductoResponse } from '../../interfaces/producto.interface';
import { AuthService } from '../../services/auth/auth.service';

type Vista = 'lista' | 'crear' | 'editar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {
  private productService = inject(ProductoService);
  public auth = inject(AuthService);

  vista = signal<Vista>('lista');
  productos = signal<ProductoResponse[]>([]);
  loading = signal(false);
  productoEditando = signal<ProductoResponse | null>(null);
  productoAEliminar = signal<ProductoResponse | null>(null);

  nombre = '';
  descripcion = '';
  precio: number | null = null;
  categoria = 'masculino';
  imagenFile: File | null = null;
  imagenPreview = signal<string | null>(null);
  talles = signal<{ talle: number; stock: number }[]>([]);
  enviando = signal(false);
  exito = signal('');
  errorMsg = signal('');

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading.set(true);
    this.productService.getProductos().subscribe({
      next: (data) => { this.productos.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  mostrarCrear() {
    this.limpiarForm();
    this.vista.set('crear');
  }

  mostrarEditar(p: ProductoResponse) {
    this.productoEditando.set(p);
    this.nombre = p.nombre;
    this.descripcion = p.descripcion;
    this.precio = Number(p.precio);
    this.categoria = p.categoria;
    this.talles.set(p.talles.map(t => ({ talle: t.numero_talle, stock: t.stock })));
    this.imagenPreview.set(null);
    this.imagenFile = null;
    this.exito.set('');
    this.errorMsg.set('');
    this.vista.set('editar');
  }

  volverLista() {
    this.vista.set('lista');
    this.cargarProductos();
  }

  limpiarForm() {
    this.nombre = '';
    this.descripcion = '';
    this.precio = null;
    this.categoria = 'masculino';
    this.imagenFile = null;
    this.imagenPreview.set(null);
    this.talles.set([]);
    this.exito.set('');
    this.errorMsg.set('');
    this.productoEditando.set(null);
  }

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

    if (!this.nombre?.trim()) { this.errorMsg.set('El nombre es obligatorio.'); return; }
    if (!this.descripcion?.trim()) { this.errorMsg.set('La descripción es obligatoria.'); return; }
    if (!this.precio || this.precio <= 0) { this.errorMsg.set('El precio debe ser mayor a 0.'); return; }

    const tallesValidos = this.talles().filter(t => t.talle > 0 && t.stock >= 0);
    if (tallesValidos.length === 0) {
      this.errorMsg.set('Agregá al menos un talle.');
      return;
    }

    this.enviando.set(true);

    const formData = new FormData();
    formData.append('nombre', this.nombre.trim());
    formData.append('descripcion', this.descripcion.trim());
    formData.append('precio', String(this.precio));
    formData.append('categoria', this.categoria);
    if (this.imagenFile) formData.append('imagen', this.imagenFile);
    formData.append('talles', JSON.stringify(
      tallesValidos.map(t => ({ numero_talle: Number(t.talle), stock: Number(t.stock) }))
    ));

    const esEdicion = this.vista() === 'editar' && this.productoEditando();

    const request = esEdicion
      ? this.productService.updateProducto(this.productoEditando()!.id, formData)
      : this.productService.createProducto(formData);

    request.subscribe({
      next: () => {
        this.enviando.set(false);
        this.exito.set(esEdicion ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
        setTimeout(() => {
          this.exito.set('');
          this.volverLista();
        }, 1500);
      },
      error: (err) => {
        this.enviando.set(false);
        const msg = err?.error?.details || err?.error?.msg || '';
        this.errorMsg.set(msg || 'Error al guardar el producto.');
      }
    });
  }

  confirmarEliminar(p: ProductoResponse) {
    this.productoAEliminar.set(p);
  }

  cancelarEliminar() {
    this.productoAEliminar.set(null);
  }

  eliminarProducto() {
    const p = this.productoAEliminar();
    if (!p) return;

    this.productService.deleteProducto(p.id).subscribe({
      next: () => {
        this.productoAEliminar.set(null);
        this.exito.set('Producto eliminado.');
        this.cargarProductos();
        setTimeout(() => this.exito.set(''), 3000);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.msg || 'Error al eliminar.');
      }
    });
  }
}
