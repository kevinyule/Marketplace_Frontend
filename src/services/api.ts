import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:3006/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos TypeScript
export interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Proyecto {
  _id?: string;
  nombre: string;
  descripcion: string;
  imagenes?: string[];
  documentacion?: string;
  tecnologias?: string[];
  enlaceDemo?: string;
  enlaceRepositorio?: string;
  autor: string | Usuario;
  fechaCreacion?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginData {
  correo: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  contraseña: string;
}

export interface ApiResponse<T> {
  mensaje: string;
  usuario?: T;
  proyecto?: T;
}

// Servicios de Usuario
export const usuarioService = {
  // Registro
  registro: (data: RegisterData) =>
    api.post<ApiResponse<Usuario>>('/usuarios/registro', data),

  // Login
  login: (data: LoginData) =>
    api.post<ApiResponse<Usuario>>('/usuarios/login', data),

  // Obtener usuario por ID
  obtenerUsuario: (id: string) =>
    api.get<Usuario>(`/usuarios/${id}`),

  // Actualizar usuario
  actualizarUsuario: (id: string, data: Partial<Usuario>) =>
    api.put<ApiResponse<Usuario>>(`/usuarios/${id}`, data),

  // Obtener todos los usuarios
  obtenerTodos: () =>
    api.get<Usuario[]>('/usuarios'),
};

// Servicios de Proyecto
export const proyectoService = {
  // Crear proyecto
  crear: (data: Omit<Proyecto, '_id'>) =>
    api.post<ApiResponse<Proyecto>>('/proyectos', data),

  // Obtener todos los proyectos
  obtenerTodos: () =>
    api.get<Proyecto[]>('/proyectos'),

  // Obtener proyecto por ID
  obtenerPorId: (id: string) =>
    api.get<Proyecto>(`/proyectos/${id}`),

  // Obtener proyectos por usuario
  obtenerPorUsuario: (userId: string) =>
    api.get<Proyecto[]>(`/proyectos/usuario/${userId}`),

  // Actualizar proyecto
  actualizar: (id: string, data: Partial<Proyecto>) =>
    api.put<ApiResponse<Proyecto>>(`/proyectos/${id}`, data),

  // Eliminar proyecto
  eliminar: (id: string) =>
    api.delete<ApiResponse<any>>(`/proyectos/${id}`),

  // Buscar por tecnología
  buscarPorTecnologia: (tecnologia: string) =>
    api.get<Proyecto[]>(`/proyectos/buscar/${tecnologia}`),
};

export default api;