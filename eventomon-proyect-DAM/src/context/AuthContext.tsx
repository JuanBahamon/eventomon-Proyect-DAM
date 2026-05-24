import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../helpers/Firebase';

interface ContextoAuthTipo {
  usuario: User | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
}

const ContextoAuth = createContext<ContextoAuthTipo>({
  usuario: null,
  cargando: true,
  cerrarSesion: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });

    return () => unsub();
  }, []);

  const cerrarSesion = async (): Promise<void> => {
    await signOut(auth);
  };

  return (
    <ContextoAuth.Provider value={{ usuario, cargando, cerrarSesion }}>
      {children}
    </ContextoAuth.Provider>
  );
};

export const usarContextoAuth = () => useContext(ContextoAuth);