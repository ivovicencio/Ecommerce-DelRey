import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { CartModal } from './components/cart-modal/cart-modal';
import { Carrito } from './services/carrito/carrito';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Header, Footer, CartModal],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Del Rey');
  public carrito = inject(Carrito);
}
