import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto/producto.service';
import { PedidoService } from '../../services/pedido/pedido.service';
import { ProductoResponse } from '../../interfaces/producto.interface';
import { Pedido, DetallePedido, ResumenPedidos } from '../../interfaces/pedido.interface';
import { AuthService } from '../../services/auth/auth.service';

type TabAdmin = 'productos' | 'pedidos' | 'estadisticas';
type VistaProd = 'lista' | 'crear' | 'editar';

const TIPOS = ['urbano', 'deportivo', 'formal', 'botas'] as const;
const CATEGORIAS = ['masculino', 'femenino', 'unisex'] as const;

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class Admin implements OnInit {
  private productService = inject(ProductoService);
  private pedidoService = inject(PedidoService);
  private route = inject(ActivatedRoute);
  public auth = inject(AuthService);

  tab = signal<TabAdmin>('productos');
  vistaProd = signal<VistaProd>('lista');

  // ─── Productos ───
  productos = signal<ProductoResponse[]>([]);
  loadingProd = signal(false);
  productoEditando = signal<ProductoResponse | null>(null);
  productoAEliminar = signal<ProductoResponse | null>(null);

  prodNombre = '';
  prodDesc = '';
  prodPrecio: number | null = null;
  prodCategoria = 'masculino';
  prodTipo = '';
  prodImagenFile: File | null = null;
  prodImagenPreview = signal<string | null>(null);
  prodTalles = signal<number[]>([]);
  enviando = signal(false);
  exito = signal('');
  errorMsg = signal('');

  // ─── Pedidos ───
  pedidos = signal<Pedido[]>([]);
  loadingPed = signal(false);
  filtroEstado = 'todos';
  pedidoDetalle = signal<Pedido | null>(null);
  pedidoConfirmando = signal<number | null>(null);

  // ─── Estadísticas ───
  resumen = signal<ResumenPedidos | null>(null);
  loadingEst = signal(false);

  readonly TIPOS = TIPOS;
  readonly CATEGORIAS = CATEGORIAS;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'] as TabAdmin;
      if (tabParam && ['productos', 'pedidos', 'estadisticas'].includes(tabParam)) {
        this.cambiarTab(tabParam);
      } else {
        this.cargarProductos();
      }
    });
  }

  // ─── Cambio de tabs ───
  cambiarTab(t: TabAdmin) {
    this.tab.set(t);
    this.exito.set('');
    this.errorMsg.set('');
    const url = t === 'productos' ? '/gestion' : `/gestion?tab=${t}`;
    window.history.replaceState({}, '', url);
    if (t === 'pedidos') { this.cargarProductos(); this.cargarPedidos(); }
    if (t === 'estadisticas') this.cargarResumen();
  }

  // ════════════════════════════════════════════
  //  PRODUCTOS
  // ════════════════════════════════════════════

  cargarProductos() {
    this.loadingProd.set(true);
    this.productService.getProductos().subscribe({
      next: (data) => { this.productos.set(data); this.loadingProd.set(false); },
      error: () => { this.loadingProd.set(false); }
    });
  }

  mostrarCrear() {
    this.limpiarFormProd();
    this.vistaProd.set('crear');
  }

  mostrarEditar(p: ProductoResponse) {
    this.productoEditando.set(p);
    this.prodNombre = p.nombre;
    this.prodDesc = p.descripcion;
    this.prodPrecio = Number(p.precio);
    this.prodCategoria = p.categoria;
    this.prodTipo = p.tipo || '';
    this.prodTalles.set(p.talles || []);
    this.prodImagenPreview.set(null);
    this.prodImagenFile = null;
    this.exito.set('');
    this.errorMsg.set('');
    this.vistaProd.set('editar');
  }

  volverListaProd() {
    this.vistaProd.set('lista');
    this.cargarProductos();
  }

  limpiarFormProd() {
    this.prodNombre = '';
    this.prodDesc = '';
    this.prodPrecio = null;
    this.prodCategoria = 'masculino';
    this.prodTipo = '';
    this.prodImagenFile = null;
    this.prodImagenPreview.set(null);
    this.prodTalles.set([]);
    this.exito.set('');
    this.errorMsg.set('');
    this.productoEditando.set(null);
  }

  toggleTalle(t: number) {
    this.prodTalles.update(list =>
      list.includes(t) ? list.filter(x => x !== t) : [...list, t].sort((a, b) => a - b)
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.prodImagenFile = file;
      const reader = new FileReader();
      reader.onload = () => this.prodImagenPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  guardarProducto() {
    this.errorMsg.set('');

    if (!this.prodNombre?.trim()) { this.errorMsg.set('El nombre es obligatorio.'); return; }
    if (!this.prodDesc?.trim()) { this.errorMsg.set('La descripción es obligatoria.'); return; }
    if (!this.prodPrecio || this.prodPrecio <= 0) { this.errorMsg.set('El precio debe ser mayor a 0.'); return; }
    if (this.prodTalles().length === 0) { this.errorMsg.set('Seleccioná al menos un talle.'); return; }

    this.enviando.set(true);

    const formData = new FormData();
    formData.append('nombre', this.prodNombre.trim());
    formData.append('descripcion', this.prodDesc.trim());
    formData.append('precio', String(this.prodPrecio));
    formData.append('categoria', this.prodCategoria);
    formData.append('tipo', this.prodTipo);
    if (this.prodImagenFile) formData.append('imagen', this.prodImagenFile);
    formData.append('talles', JSON.stringify(this.prodTalles()));

    const esEdicion = this.vistaProd() === 'editar' && this.productoEditando();

    const request = esEdicion
      ? this.productService.updateProducto(this.productoEditando()!.id, formData)
      : this.productService.createProducto(formData);

    request.subscribe({
      next: () => {
        this.enviando.set(false);
        this.exito.set(esEdicion ? 'Producto actualizado.' : 'Producto creado.');
        setTimeout(() => { this.exito.set(''); this.volverListaProd(); }, 1500);
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

  // ════════════════════════════════════════════
  //  PEDIDOS
  // ════════════════════════════════════════════

  cargarPedidos() {
    this.loadingPed.set(true);
    this.pedidoService.getPedidos(this.filtroEstado).subscribe({
      next: (data) => { this.pedidos.set(data); this.loadingPed.set(false); },
      error: () => { this.loadingPed.set(false); }
    });
  }

  cambiarFiltroEstado() {
    this.cargarPedidos();
  }

  verDetalle(p: Pedido) {
    this.pedidoDetalle.set(p);
  }

  cerrarDetalle() {
    this.pedidoDetalle.set(null);
  }

  confirmarPedido(id: number) {
    this.pedidoConfirmando.set(id);
    this.pedidoService.confirmarPedido(id).subscribe({
      next: () => {
        this.pedidoConfirmando.set(null);
        this.pedidoDetalle.set(null);
        this.exito.set('Pedido confirmado correctamente.');
        this.cargarPedidos();
        setTimeout(() => this.exito.set(''), 3000);
      },
      error: (err) => {
        this.pedidoConfirmando.set(null);
        this.errorMsg.set(err?.error?.msg || 'Error al confirmar pedido.');
      }
    });
  }

  cancelarPedido(id: number) {
    if (!confirm('¿Cancelar este pedido?')) return;
    this.pedidoService.cancelarPedido(id).subscribe({
      next: () => {
        this.pedidoDetalle.set(null);
        this.exito.set('Pedido cancelado.');
        this.cargarPedidos();
        setTimeout(() => this.exito.set(''), 3000);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.msg || 'Error al cancelar pedido.');
      }
    });
  }

  // ════════════════════════════════════════════
  //  ESTADÍSTICAS
  // ════════════════════════════════════════════

  cargarResumen() {
    this.loadingEst.set(true);
    this.pedidoService.getResumen().subscribe({
      next: (data) => { this.resumen.set(data); this.loadingEst.set(false); },
      error: () => { this.loadingEst.set(false); }
    });
  }

  exportarExcel() {
    const r = this.resumen();
    if (!r) return;

    let csv = '\uFEFF'; // BOM para Excel
    csv += 'Código,Cliente,Dirección,Total,Estado,Fecha\n';
    r.pedidos.forEach((p: Pedido) => {
      const nom = p.cliente_nombre || '';
      const dir = p.cliente_direccion || '';
      csv += `"${p.codigo}","${nom}","${dir}",${Number(p.total).toFixed(2)},"${p.estado}","${new Date(p.fecha).toLocaleDateString()}"\n`;
    });

    csv += '\n';
    csv += `Total pedidos,,,${r.totalPedidos},,\n`;
    csv += `Completados,,,${r.completados},,\n`;
    csv += `Cancelados,,,${r.cancelados},,\n`;
    csv += `Pendientes,,,${r.pendientes},,\n`;
    csv += `Total ingresos,,,$${r.totalIngresos.toFixed(2)},,\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `delrey_resumen_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // ════════════════════════════════════════════
  //  UTILIDADES
  // ════════════════════════════════════════════

  getNombreProducto(productoId: number): string {
    if (!productoId) return 'Producto eliminado';
    const p = this.productos().find(x => x.id === productoId);
    return p ? p.nombre : `Producto #${productoId}`;
  }
}
