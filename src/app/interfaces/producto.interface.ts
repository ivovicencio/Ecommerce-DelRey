export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string | number;
  categoria: string;
  tipo?: string;
  talles: number[];
  imagen_url: string;
}
