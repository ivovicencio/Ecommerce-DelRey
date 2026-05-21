import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carrito } from '../../services/carrito/carrito';
import { ProductoService } from '../../services/producto/producto.service';
import { ProductoResponse } from '../../interfaces/producto.interface';

const TIPOS = ['urbano', 'deportivo', 'formal', 'botas'] as const;
const ITEMS_POR_PAGINA = 8;

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
    tipoActual = 'todos';
    loading = signal(true);
    error = signal('');
    paginaActual = signal(1);

    productoAgregado = signal<{ producto: ProductoResponse; talle: number } | null>(null);
    talleSeleccionado = signal<Record<number, number>>({});

    readonly TIPOS = TIPOS;
    readonly ITEMS_POR_PAGINA = ITEMS_POR_PAGINA;

    get filtrosActivos(): boolean {
      return this.categoriaActual !== 'todos' || this.tipoActual !== 'todos';
    }

    totalPaginas = computed(() => Math.max(1, Math.ceil(this.productosFiltrados().length / ITEMS_POR_PAGINA)));

    productosPaginados = computed(() => {
      const inicio = (this.paginaActual() - 1) * ITEMS_POR_PAGINA;
      return this.productosFiltrados().slice(inicio, inicio + ITEMS_POR_PAGINA);
    });

    cambiarPagina(p: number) {
      if (p >= 1 && p <= this.totalPaginas()) {
        this.paginaActual.set(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    limpiarFiltros() {
      this.categoriaActual = 'todos';
      this.tipoActual = 'todos';
      this.paginaActual.set(1);
      this.aplicarFiltros();
    }

    ngOnInit() {
      const filtroGuardado = localStorage.getItem('delrey_filtro');
      if (filtroGuardado && ['masculino', 'femenino', 'unisex'].includes(filtroGuardado)) {
        this.categoriaActual = filtroGuardado;
        localStorage.removeItem('delrey_filtro');
      }
      this.cargarProductos();
    }

    cargarProductos() {
      this.loading.set(true);
      this.error.set('');
      this.productService.getProductos().subscribe({
        next: (data) => {
          this.productos.set(data);
          this.aplicarFiltros();
          this.loading.set(false);
          const talles: Record<number, number> = {};
          data.forEach(p => {
            if (p.talles && p.talles.length > 0) {
              talles[p.id] = p.talles[0];
            }
          });
          this.talleSeleccionado.set(talles);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudieron cargar los productos.');
        }
      });
    }

    filtrar(cat: string) {
      this.categoriaActual = cat;
      this.paginaActual.set(1);
      this.aplicarFiltros();
    }

    filtrarTipo(tipo: string) {
      this.tipoActual = tipo;
      this.paginaActual.set(1);
      this.aplicarFiltros();
    }

    private aplicarFiltros() {
      let filtrados = this.productos();
      if (this.categoriaActual !== 'todos') {
        filtrados = filtrados.filter(p => p.categoria === this.categoriaActual);
      }
      if (this.tipoActual !== 'todos') {
        filtrados = filtrados.filter(p => p.tipo === this.tipoActual);
      }
      this.productosFiltrados.set(filtrados);
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
}
