import React from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  cartOutline, heartOutline, cardOutline,
  settingsOutline, helpCircleOutline, logOutOutline
} from 'ionicons/icons';
import { useAuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import styles from './Perfil.module.scss';

const Perfil: React.FC = () => {
  const { usuario, cerrarSesion } = useAuthContext();
  const history = useHistory();

  const handleLogout = async () => {
    await cerrarSesion();
    history.replace('/ingreso');
  };

  const nombre = usuario?.email?.split('@')[0] ?? 'Usuario';
  const inicial = nombre.charAt(0).toUpperCase();

  const menuItems = [
    { icon: cartOutline, label: 'Mi carrito', sub: 'Vacío', action: () => history.push('/app/carrito') },
    { icon: heartOutline, label: 'Guardados', sub: '12 eventos', action: () => { } },
    { icon: cardOutline, label: 'Métodos de pago', sub: 'Visa · 4321', action: () => { } },
    { icon: settingsOutline, label: 'Preferencias', sub: 'Idioma, notificaciones', action: () => { } },
    { icon: helpCircleOutline, label: 'Ayuda', sub: 'Soporte 24/7', action: () => { } },
  ];

  return (
    <IonPage>
      <IonContent className={styles.content}>
        <h1 className={styles.title}>Perfil</h1>

        <div className={styles.userCard}>
          <div className={styles.avatar}>
            <span className={styles.avatarLetter}>{inicial}</span>
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{nombre}</h2>
            <p className={styles.userEmail}>{usuario?.email}</p>
            <span className={styles.premiumBadge}>MIEMBRO PREMIUM</span>
          </div>
        </div>
        
        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.statNum}>14</p>
            <p className={styles.statLabel}>ASISTIDOS</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNum}>6</p>
            <p className={styles.statLabel}>PRÓXIMOS</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNum}>48</p>
            <p className={styles.statLabel}>GUARDADOS</p>
          </div>
        </div>

        <div className={styles.menu}>
          {menuItems.map((item, index) => (
            <div key={index} className={styles.menuItem} onClick={item.action}>
              <div className={styles.menuIcon}>
                <IonIcon icon={item.icon} />
              </div>
              <div className={styles.menuInfo}>
                <p className={styles.menuLabel}>{item.label}</p>
                <p className={styles.menuSub}>{item.sub}</p>
              </div>
              <span className={styles.menuArrow}>›</span>
            </div>
          ))}
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <IonIcon icon={logOutOutline} />
          Cerrar sesión
        </button>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;