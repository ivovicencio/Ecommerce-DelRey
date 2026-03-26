import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carrito } from '../../services/carrito/carrito';
//definimos temporalmente los datos del producto
interface Producto{
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
}


@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class Catalogo {

    public carrito = inject(Carrito); 

    productoAgregado = signal<Producto | null>(null);

// 1. LISTA DE PRODUCTOS (Datos inventados en assets)
  productos: Producto[] = [
    { id: 1, nombre: 'Zapatilla Urban Gold', categoria: 'masculino', precio: 45000, imagen: 'assets/images/zapa1.jpg', descripcion: 'Estilo urbano con detalles dorados.' },
    { id: 2, nombre: 'Stiletto Royal', categoria: 'femenino', precio: 55000, imagen: 'assets/images/zapa2.jpg', descripcion: 'Elegancia pura para ocasiones especiales.' },
    { id: 3, nombre: 'Botas Trekking Sky', categoria: 'masculino', precio: 62000, imagen: 'assets/images/zapa3.jpg', descripcion: 'Resistencia y comodidad en cada paso.' },
    { id: 4, nombre: 'Sandalias Mauve', categoria: 'femenino', precio: 32000, imagen: 'assets/images/zapa4.jpg', descripcion: 'Frescura con nuestro color insignia.' },
  ];

  productosFiltrados = [...this.productos];
  categoriaActual = 'todos';

  filtrar(cat: string) {
    this.categoriaActual = cat;
    this.productosFiltrados = cat === 'todos' ? [...this.productos] : this.productos.filter(p => p.categoria === cat);
  }

  // 4. FUNCIÓN AGREGAR AL CARRITO
  agregarAlCarrito(producto: Producto) {
    this.carrito.agregar(producto);
    this.productoAgregado.set(producto);
    // El modal se mostrará automáticamente con *ngIf
  }
}
