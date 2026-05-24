import React, { useState } from 'react';
import {
  IonPage, IonContent, IonInput,
  IonButton, IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/UseAuth';
import styles from './Registro.module.scss';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { register, loading } = useAuth();
  const history = useHistory();

  const handleRegistro = async () => {
    if (!nombre || !email || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    const resultado = await register(nombre, email, password);
    if (resultado.success) {
      window.location.href = '/app/inicio';
    } else {
      setError(resultado.error || 'Error desconocido');
    }
  };

  return (
    <IonPage>
      <IonContent className={styles.contenido}>
        <div className={styles.contenedor}>
          <div className={styles.logo}>
            <h1 className={styles.titulo}>EVNT</h1>
            <p className={styles.subtitulo}>Crea tu cuenta</p>
          </div>

          <div className={styles.formulario}>
            <div className={styles.campoGrupo}>
              <IonInput
                className={styles.campo}
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onIonInput={(e) => setNombre(e.detail.value ?? '')}
              />
            </div>

            <div className={styles.campoGrupo}>
              <IonInput
                className={styles.campo}
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value ?? '')}
              />
            </div>

            <div className={styles.campoGrupo}>
              <IonInput
                className={styles.campo}
                type="password"
                placeholder="Contraseña (mín. 6 caracteres)"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value ?? '')}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <IonButton
              className={styles.botonPrimario}
              expand="block"
              onClick={handleRegistro}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : 'Crear cuenta'}
            </IonButton>

            <p className={styles.textoLink}>
              ¿Ya tienes cuenta?{' '}
              <span
                className={styles.link}
                onClick={() => history.push('/ingreso')}
              >
                Inicia sesión
              </span>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;