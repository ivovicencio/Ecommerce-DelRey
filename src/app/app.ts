import { CommonModule } from '@angular/common';
import { Component, signal, inject, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, query, group, animate } from '@angular/animations';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { CartModal } from './components/cart-modal/cart-modal';
import { Carrito } from './services/carrito/carrito';

const routeFade = trigger('routeFade', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(12px)' }),
      animate('0.35s cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Header, Footer, CartModal],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  animations: [routeFade]
})
export class App {
  protected readonly title = signal('Del Rey');
  public carrito = inject(Carrito);

  showScrollTop = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
