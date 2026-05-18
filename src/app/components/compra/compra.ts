import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carrito } from '../../services/carrito/carrito';
import { PedidoService, DetallePedidoRequest } from '../../services/pedido/pedido.service';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './compra.html',
  styleUrls: ['./compra.css'],
})
export class Compra {
  public carrito = inject(Carrito);
  private pedidoService = inject(PedidoService);

  nombre = signal('');
  direccion = signal('');
  enviando = signal(false);
  pedidoCreado = signal<{ codigo: string } | null>(null);
  errorMsg = signal('');

  pedirPorWhatsApp() {
    const items = this.carrito.carritoItems();
    const nombre = this.nombre().trim();
    const direccion = this.direccion().trim();

    if (!nombre) { this.errorMsg.set('Por favor ingresá tu nombre.'); return; }
    if (!direccion) { this.errorMsg.set('Por favor ingresá tu dirección.'); return; }
    if (items.length === 0) { this.errorMsg.set('El carrito está vacío.'); return; }

    this.errorMsg.set('');
    this.enviando.set(true);

    const detalleItems: DetallePedidoRequest[] = items.map(item => ({
      producto_id: item.id,
      talle: item.talle,
      cantidad: item.cantidad,
      precio_unitario: item.precio
    }));

    this.pedidoService.createPedido(this.carrito.totalPagar(), detalleItems).subscribe({
      next: (resp) => {
        this.pedidoCreado.set({ codigo: resp.codigo });
        this.enviando.set(false);
        this.abrirWhatsApp(resp.codigo, nombre, direccion, items, this.carrito.totalPagar());
        this.carrito.vaciar();
      },
      error: () => {
        this.errorMsg.set('Error al crear el pedido. Intentá de nuevo.');
        this.enviando.set(false);
      }
    });
  }

  private abrirWhatsApp(codigo: string, nombre: string, direccion: string, items: any[], total: number) {
    let mensaje = `Hola, soy ${nombre}. Quiero confirmar mi pedido:\n\n`;
    mensaje += `Código: ${codigo}\n\n`;
    items.forEach(item => {
      mensaje += `• ${item.nombre} (Talle: ${item.talle}) x ${item.cantidad} = $${item.precio * item.cantidad}\n`;
    });
    mensaje += `\nTotal: $${total}`;
    mensaje += `\nDirección de entrega: ${direccion}`;
    mensaje += `\n\nDel Rey Calzados`;

    const numeroWhatsApp = '5491234567890';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}