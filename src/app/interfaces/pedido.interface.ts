export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  talle: number;
  cantidad: number;
  precio_unitario: string | number;
}

export interface Pedido {
  id: number;
  codigo: string;
  cliente_nombre: string;
  cliente_direccion: string;
  metodo_pago: string;
  total: string | number;
  estado: 'Pendiente' | 'Completado' | 'Cancelado';
  fecha: string;
  items: DetallePedido[];
}

export interface ResumenPedidos {
  totalPedidos: number;
  pendientes: number;
  completados: number;
  cancelados: number;
  totalIngresos: number;
  pedidos: Pedido[];
}