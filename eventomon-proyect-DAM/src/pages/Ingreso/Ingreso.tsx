import React, { useState } from 'react';
import {
  IonPage, IonContent, IonInput,
  IonButton, IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { UseAuth } from '../../hooks/UseAuth';
import styles from './Ingreso.module.scss';

const Ingreso: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { ingresar, cargando } = UseAuth();
  const history = useHistory();

  const handleIngreso = async () => {
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    const resultado = await ingresar(email, password);
    if (resultado.exito) {
      window.location.href = '/app/inicio';
    } else {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <IonPage>
      <IonContent className={styles.contenido}>
        <div className={styles.contenedor}>
          <div className={styles.logo}>
            <h1 className={styles.titulo}>EVNT</h1>
            <p className={styles.subtitulo}>Descubre experiencias únicas</p>
          </div>

          <div className={styles.formulario}>
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
                placeholder="Contraseña"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value ?? '')}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <IonButton
              className={styles.botonPrimario}
              expand="block"
              onClick={handleIngreso}
              disabled={cargando}
            >
              {cargando ? <IonSpinner name="crescent" /> : 'Ingresar'}
            </IonButton>

            <p className={styles.textoLink}>
              ¿No tienes cuenta?{' '}
              <span
                className={styles.link}
                onClick={() => history.push('/registro')}
              >
                Regístrate
              </span>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Ingreso;