import React, { useState } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useCamera } from '../../Hooks/UseCamera';
import { useAccelerometer } from '../../Hooks/UseAccelerometer';
import styles from './Escaner.module.scss';

const Escaner: React.FC = () => {
  const { takePhoto, loading } = useCamera();
  const [photo, setPhoto] = useState<string | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleShake = () => {
    setPhoto(null);
    setScanned(false);
    setError(null);
  };

  const { isShaking } = useAccelerometer(handleShake);

  const handleScan = async () => {
    const result = await takePhoto();
    if (result.image) {
      setPhoto(result.image);
      setScanned(true);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  return (
    <IonPage>
      <IonContent className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>QR Scanner</h1>
          <p className={styles.subtitle}>Escanea el código QR de tu ticket</p>
        </div>

        <div className={styles.scannerArea}>
          {photo ? (
            <img src={photo} alt="scanned" className={styles.scannedPhoto} />
          ) : (
            <div className={styles.frame}>
              <div className={styles.corner} />
              <div className={`${styles.corner} ${styles.cornerTR}`} />
              <div className={`${styles.corner} ${styles.cornerBL}`} />
              <div className={`${styles.corner} ${styles.cornerBR}`} />
              <div className={styles.scanLine} />
            </div>
          )}
        </div>

        {isShaking && (
          <div className={styles.shakeAlert}>
            Vibracion detectada resetear scanner
          </div>
        )}

        {scanned && (
          <div className={styles.successCard}>
            <p className={styles.successIcon}>✅</p>
            <p className={styles.successText}>Ticket escaneado correctamente</p>
            <p className={styles.successSub}>Agita el teléfono para volver a escanear</p>
          </div>
        )}

        {error && (
          <div className={styles.errorCard}>
            <p className={styles.errorText}>❌ {error}</p>
          </div>
        )}

        {/* Button */}
        {!scanned && (
          <button
            className={styles.scanBtn}
            onClick={handleScan}
            disabled={loading}
          >
            {loading ? (
              <IonSpinner name="crescent" />
            ) : (
              'Abrir Camara'
            )}
          </button>
        )}

        <p className={styles.hint}>
          {scanned
            ? 'Agita para resetear el escaner'
            : 'Apunta al código QR de tu ticket y presiona el botón para escanear'}
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Escaner;