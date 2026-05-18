export interface StockTalle {
  id?: number;
  producto_id?: number;
  numero_talle: number;
  stock: number;
}

export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string | number;
  categoria: string;
  imagen_url: string;
  talles: StockTalle[];
}
