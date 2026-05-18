export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'cliente';
}

export interface AuthResponse {
  status: string;
  token: string;
  usuario: Usuario;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}
