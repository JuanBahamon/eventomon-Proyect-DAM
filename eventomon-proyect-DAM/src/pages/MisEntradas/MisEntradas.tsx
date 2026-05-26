import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useEvents } from '../../context/EventsContext';
import { formatDate } from '../../helpers/FormatDate';
import { useHistory } from 'react-router-dom';
import styles from './MisEntradas.module.scss';

const MisEntradas: React.FC = () => {
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const history = useHistory();

  const myTickets = events.slice(0, 2);

  return (
    <IonPage>
      <IonContent className={styles.content}>
        <h1 className={styles.title}>Mis entradas</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Próximos
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'past' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Pasados
          </button>
        </div>

        <div className={styles.list}>
          {myTickets.map((event, index) => (
            <div
              key={event.id}
              className={styles.ticket}
              onClick={() => history.push(`/app/evento/${event.id}`)}
            >
              <img src={event.image} alt={event.title} className={styles.ticketImage} />
              <div className={styles.ticketInfo}>
                <span className={styles.ticketBadge}>
                  {index === 0 ? 'VIP' : 'GENERAL'}
                </span>
                <h3 className={styles.ticketTitle}>{event.title}</h3>
                <p className={styles.ticketDate}>{formatDate(event.date)} · {event.place}</p>
              </div>
              <button className={styles.qrBtn}>⊞</button>
            </div>
          ))}
        </div>

        <div className={styles.chatsSection}>
          <p className={styles.chatsLabel}>CHATS DE EVENTO</p>
          {myTickets.map((event) => (
            <div
              key={event.id}
              className={styles.chatItem}
              onClick={() => history.push(`/app/chat/${event.id}`)}
            >
              <div className={styles.chatIcon}>💬</div>
              <div className={styles.chatInfo}>
                <p className={styles.chatTitle}>{event.title}</p>
                <p className={styles.chatSub}>{event.attendees} asistentes · 3 nuevos mensajes</p>
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MisEntradas;