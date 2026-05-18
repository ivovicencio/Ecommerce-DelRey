import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Carrito } from '../../services/carrito/carrito';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-modal.html',
  styleUrls: ['./cart-modal.css'],
})
export class CartModal {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  public carrito = inject(Carrito);

  closeModal() {
    this.close.emit();
  }

  continuarPorWhatsApp() {
    const items = this.carrito.carritoItems();
    if (items.length === 0) return;

    let mensaje = 'Hola, quiero comprar estos productos:\n\n';
    items.forEach(item => {
      mensaje += `${item.nombre} (Talle: ${item.talle}) - Cantidad: ${item.cantidad} - Precio: $${item.precio * item.cantidad}\n`;
    });
    mensaje += `\nTotal: $${this.carrito.totalPagar()}\n\nDel Rey Calzados`;

    const numeroWhatsApp = environment.whatsappNumber;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}