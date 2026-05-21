import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Carrito } from '../../services/carrito/carrito';
import { ProductoService } from '../../services/producto/producto.service';
import { ProductoResponse } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-producto.html',
  styleUrls: ['./detalle-producto.css'],
})
export class DetalleProducto implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductoService);
  public carrito = inject(Carrito);

  producto = signal<ProductoResponse | null>(null);
  relacionados = signal<ProductoResponse[]>([]);
  loading = signal(true);
  error = signal('');
  talleSeleccionado = signal<number | null>(null);
  productoAgregado = signal(false);
  imagenCargada = signal(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) this.cargarProducto(id);
    });
  }

  cargarProducto(id: number) {
    this.loading.set(true);
    this.error.set('');
    this.productService.getProducto(id).subscribe({
      next: (data) => {
        this.producto.set(data);
        this.talleSeleccionado.set(data.talles?.[0] ?? null);
        this.loading.set(false);
        this.cargarRelacionados(data.categoria, data.id);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo cargar el producto.');
      }
    });
  }

  cargarRelacionados(categoria: string, productoId: number) {
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.relacionados.set(
          data.filter(p => p.categoria === categoria && p.id !== productoId).slice(0, 4)
        );
      }
    });
  }

  seleccionarTalle(talle: number) {
    this.talleSeleccionado.set(talle);
  }

  irAProducto(id: number) {
    this.router.navigate(['/producto', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  agregarAlCarrito() {
    const prod = this.producto();
    const talle = this.talleSeleccionado();
    if (!prod || !talle) return;

    this.carrito.agregar({
      id: prod.id,
      nombre: prod.nombre,
      precio: Number(prod.precio),
      imagen: prod.imagen_url,
      descripcion: prod.descripcion,
      categoria: prod.categoria,
      talle
    });
    this.productoAgregado.set(true);
    setTimeout(() => this.productoAgregado.set(false), 2500);
  }
}
