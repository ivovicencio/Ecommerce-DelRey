import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';	
import { Carrito } from '../../services/carrito/carrito';
import { ProductoService } from '../../services/producto/producto.service';
import { ProductoResponse } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class Catalogo implements OnInit {

    public carrito = inject(Carrito);
    private productService = inject(ProductoService);

    productos = signal<ProductoResponse[]>([]);
    productosFiltrados = signal<ProductoResponse[]>([]);
    categoriaActual = 'todos';
    loading = signal(true);
    error = signal('');

    productoAgregado = signal<{ producto: ProductoResponse; talle: number } | null>(null);
    talleSeleccionado = signal<Record<number, number>>({});

    ngOnInit() {
      this.cargarProductos();
    }

    cargarProductos() {
      this.loading.set(true);
      this.error.set('');
      this.productService.getProductos().subscribe({
        next: (data) => {
          this.productos.set(data);
          this.productosFiltrados.set(data);
          this.loading.set(false);
          const talles: Record<number, number> = {};
          data.forEach(p => {
            if (p.talles && p.talles.length > 0) {
              talles[p.id] = p.talles[0].numero_talle;
            }
          });
          this.talleSeleccionado.set(talles);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set('No se pudieron cargar los productos. Verificá que el backend esté funcionando.');
        }
      });
    }

    filtrar(cat: string) {
      this.categoriaActual = cat;
      if (cat === 'todos') {
        this.productosFiltrados.set(this.productos());
      } else {
        this.productosFiltrados.set(this.productos().filter(p => p.categoria === cat));
      }
    }

    seleccionarTalle(productoId: number, talle: number) {
      this.talleSeleccionado.update(t => ({ ...t, [productoId]: talle }));
    }

    agregarAlCarrito(producto: ProductoResponse) {
      const talle = this.talleSeleccionado()[producto.id];
      if (!talle) return;

      this.carrito.agregar({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        imagen: producto.imagen_url,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        talle
      });
      this.productoAgregado.set({ producto, talle });
    }

    hayStock(producto: ProductoResponse, talle: number): boolean {
      const stockItem = producto.talles?.find(t => t.numero_talle === talle);
      return stockItem ? stockItem.stock > 0 : false;
    }
}
