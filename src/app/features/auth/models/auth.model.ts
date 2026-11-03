// Datos requeridos para iniciar sesion
export interface LoginRequest {
  email: string;
  password: string;
}

// Datos de respuesta al iniciar sesion
export interface LoginResponse {
  email?: string;
  userName?: string;
  token: string;
  roles: string[];
}

// Datos requeridos para registrar un usuario
export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface User {
  email: string;
  userName?: string;
  roles: string[];
}
