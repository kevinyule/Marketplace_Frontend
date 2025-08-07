import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

import type { Usuario } from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (usuario: Usuario) => void;
  logout: () => void;
  updateUsuario: (usuario: Usuario) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const login = (usuario: Usuario) => {
    setUsuario(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const updateUsuario = (usuarioActualizado: Usuario) => {
    setUsuario(usuarioActualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
  };

  const value = {
    usuario,
    isAuthenticated: !!usuario,
    login,
    logout,
    updateUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};