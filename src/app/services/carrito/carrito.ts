import { Injectable, signal, computed, effect } from '@angular/core';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  categoria: string;
  talle: number;
  cantidad: number;
}


@Injectable({
  providedIn: 'root',
})
export class Carrito {

  private items = signal<ProductoCarrito[]>(this.leerCarrito());

  isCartOpen = signal(false);

  carritoItems = computed(() => this.items());

  cantidadTotal = computed(() =>
    this.items().reduce((acc, p) => acc + p.cantidad, 0)
  );

  totalPagar = computed(() =>
    this.items().reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
  );

  constructor() {
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
    const key = (p: ProductoCarrito) => `${p.id}-${p.talle}`;
    const indice = actual.findIndex(p => key(p) === key(producto));

    if (indice >= 0) {
      const actualizado = actual.map(item =>
        key(item) === key(producto) ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      this.items.set(actualizado);
    } else {
      this.items.set([...actual, { ...producto, cantidad: 1 }]);
    }
  }

  quitar(id: number, talle?: number) {
    this.items.set(this.items().filter(p => !(p.id === id && (talle === undefined || p.talle === talle))));
  }

  vaciar() {
    this.items.set([]);
  }

  private leerCarrito(): ProductoCarrito[] {
    const datos = localStorage.getItem('carrito_delrey');
    return datos ? JSON.parse(datos) : [];
  }

}
