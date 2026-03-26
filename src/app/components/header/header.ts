import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Carrito } from '../../services/carrito/carrito';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  public carrito = inject(Carrito); 
  
  isMenuCollapsed = true;

  toggleMenu() { this.isMenuCollapsed = !this.isMenuCollapsed; }
  closeMenu() { this.isMenuCollapsed = true; }

  openCart() { this.carrito.openCart(); }
  closeCart() { this.carrito.closeCart(); }
}
