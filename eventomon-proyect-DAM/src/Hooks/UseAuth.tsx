import { useState } from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError
} from 'firebase/auth';

import { ref, set } from 'firebase/database';

import { auth, db } from '../helpers/Firebase';

interface ResultadoAuth {
  exito: boolean;
  error?: string;
}

export const UseAuth = () => {

  const [cargando, setCargando] = useState<boolean>(false);

  const registrar = async (
    nombre: string,
    email: string,
    password: string
  ): Promise<ResultadoAuth> => {

    setCargando(true);

    try {

      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await set(
        ref(db, `usuarios/${credencial.user.uid}`),
        {
          nombre,
          email,
          rol: 'usuario',
          premium: false,
          asistidos: 0,
          proximos: 0,
          guardados: 0,
          creadoEn: new Date().toISOString(),
        }
      );

      return {
        exito: true
      };

    } catch (e) {

      console.error(e);

      const error = e as AuthError;

      return {
        exito: false,
        error: error.message
      };

    } finally {

      setCargando(false);

    }
  };

  const ingresar = async (
    email: string,
    password: string
  ): Promise<ResultadoAuth> => {

    setCargando(true);

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return {
        exito: true
      };

    } catch (e) {

      console.error(e);

      const error = e as AuthError;

      return {
        exito: false,
        error: error.message
      };

    } finally {

      setCargando(false);

    }
  };

  return {
    registrar,
    ingresar,
    cargando
  };
};