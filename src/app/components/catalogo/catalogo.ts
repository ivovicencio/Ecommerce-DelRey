import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

// 1. LISTA DE PRODUCTOS (Datos inventados en assets)
  productos: Producto[] = [
    { id: 1, nombre: 'Zapatilla Urban Gold', categoria: 'masculino', precio: 45000, imagen: 'assets/images/zapa1.jpg', descripcion: 'Estilo urbano con detalles dorados.' },
    { id: 2, nombre: 'Stiletto Royal', categoria: 'femenino', precio: 55000, imagen: 'assets/images/zapa2.jpg', descripcion: 'Elegancia pura para ocasiones especiales.' },
    { id: 3, nombre: 'Botas Trekking Sky', categoria: 'masculino', precio: 62000, imagen: 'assets/images/zapa3.jpg', descripcion: 'Resistencia y comodidad en cada paso.' },
    { id: 4, nombre: 'Sandalias Mauve', categoria: 'femenino', precio: 32000, imagen: 'assets/images/zapa4.jpg', descripcion: 'Frescura con nuestro color insignia.' },
  ];

  // 2. VARIABLES DE ESTADO
  productosFiltrados: Producto[] = [...this.productos]; // Lo que se ve en pantalla
  categoriaActual: string = 'todos';

  // 3. FUNCIÓN DE FILTRADO
  // Recibe la categoría (ej: 'masculino') y actualiza la lista visible
  filtrar(categoria: string) {
    this.categoriaActual = categoria;
    if (categoria === 'todos') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(p => p.categoria === categoria);
    }
  }

  // 4. FUNCIÓN AGREGAR AL CARRITO
  // Por ahora, solo lanzamos una alerta para confirmar que funciona
  agregarAlCarrito(producto: Producto) {
    alert(`¡${producto.nombre} agregado al carrito!`);
    // Aquí luego conectaremos con el servicio del carrito
  }
}
