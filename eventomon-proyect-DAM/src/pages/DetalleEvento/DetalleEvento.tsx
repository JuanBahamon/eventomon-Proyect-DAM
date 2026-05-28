import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { arrowBackOutline, locationOutline, calendarOutline, peopleOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
import { useCart } from '../../context/CartContext';
import { formatDate } from '../../helpers/FormatDate';
import { formatPrice } from '../../helpers/FormatPrice';
import styles from './DetalleEvento.module.scss';

const DetalleEvento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events, loading } = useEvents();
  const { addToCart } = useCart();
  const history = useHistory();

  const event = events.find((e) => e.id === id);

  const handleAddToCart = () => {
    if (event) {
      addToCart(event);
      history.push('/app/carrito');
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className={styles.content}>
          <div className={styles.loading}>
            <IonSpinner name="crescent" color="warning" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!event) {
    return (
      <IonPage>
        <IonContent className={styles.content}>
          <p className={styles.notFound}>Evento no encontrado</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className={styles.content}>
        <div className={styles.hero}>
          <img src={event.image} alt={event.title} className={styles.image} />
          <div className={styles.heroOverlay} />
          <button className={styles.backBtn} onClick={() => history.goBack()}>
            <IonIcon icon={arrowBackOutline} />
          </button>
          <span className={styles.tagCategory}>{event.category.toUpperCase()}</span>
        </div>

        <div className={styles.body}>
          <h1 className={styles.title}>{event.title}</h1>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <IonIcon icon={calendarOutline} className={styles.infoIcon} />
              <div>
                <p className={styles.infoLabel}>Fecha</p>
                <p className={styles.infoValue}>{formatDate(event.date)} · {event.time}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <IonIcon icon={locationOutline} className={styles.infoIcon} />
              <div>
                <p className={styles.infoLabel}>Lugar</p>
                <p className={styles.infoValue}>{event.place}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <IonIcon icon={peopleOutline} className={styles.infoIcon} />
              <div>
                <p className={styles.infoLabel}>Asistentes</p>
                <p className={styles.infoValue}>{event.attendees} confirmados</p>
              </div>
            </div>
          </div>

          <div className={styles.descriptionContainer}>
            <h3 className={styles.descriptionTitle}>Sobre el evento</h3>
            <p className={styles.description}>{event.description}</p>
          </div>

          <button
            className={styles.chatBtn}
            onClick={() => history.push(`/app/chat/${event.id}`)}
          >
            Chat de asistentes ({event.attendees})
          </button>
        </div>

        <div className={styles.footer}>
          <div>
            <p className={styles.footerLabel}>Precio</p>
            <p className={styles.footerPrice}>{formatPrice(event.price)}</p>
          </div>
          <IonButton className={styles.buyBtn} onClick={handleAddToCart}>
            Comprar entrada
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DetalleEvento;