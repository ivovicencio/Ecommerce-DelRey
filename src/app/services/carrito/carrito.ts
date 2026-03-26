import { Injectable, signal, computed, effect } from '@angular/core';

export interface Producto{
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}


@Injectable({
  providedIn: 'root',
})
export class Carrito {

  // Lista privada de productos
  private items = signal<Producto[]>(this.leerCarrito());

  // Estado del modal del carrito
  isCartOpen = signal(false);

  // Exponemos los datos para los componentes
  carritoItems = computed(() => this.items());
  
  // EL CONTADOR: Se calcula solo sumando las cantidades
  cantidadTotal = computed(() => 
    this.items().reduce((acc, p) => acc + p.cantidad, 0)
  );

  totalPagar = computed(() => 
    this.items().reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
  );

  constructor() {
    // Cada vez que 'items' cambie, guardamos en el navegador
    effect(() => {
      localStorage.setItem('carrito_delrey', JSON.stringify(this.items()));
    });
  }

  openCart() {
    this.isCartOpen.set(true);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  toggleCart() {
    this.isCartOpen.update(v => !v);
  }

  agregar(producto: any) {
    const actual = this.items();
    const indice = actual.findIndex(p => p.id === producto.id);

    if (indice >= 0) {
      const actualizado = actual.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      this.items.set(actualizado);
    } else {
      this.items.set([...actual, { ...producto, cantidad: 1 }]);
    }
  }

  quitar(id: number) {
    this.items.set(this.items().filter(p => p.id !== id));
  }

  private leerCarrito(): Producto[] {
    const datos = localStorage.getItem('carrito_delrey');
    return datos ? JSON.parse(datos) : [];
  }
  
}
