import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../helpers/Firebase';
import { useAuth } from "../../hooks/UseAuth";
import { formatDate } from '../../helpers/FormatDate';
import { useHistory } from 'react-router-dom';
import { PurchasedTicket } from '../../context/CartContext';
import styles from './MisEntradas.module.scss';

const MisEntradas: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<PurchasedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const ticketsRef = ref(db, `tickets/${user.uid}`);
    const unsubscribe = onValue(ticketsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed: PurchasedTicket[] = Object.entries(data).map(([id, val]) => ({
          ...(val as Omit<PurchasedTicket, 'id'>),
          id,
        }));
        setTickets(parsed);
      } else {
        setTickets([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const now = new Date();
  const upcoming = tickets.filter((t) => new Date(t.eventDate) >= now);
  const past = tickets.filter((t) => new Date(t.eventDate) < now);
  const displayed = activeTab === 'upcoming' ? upcoming : past;

  return (
    <IonPage>
      <IonContent className={styles.content}>
        <h1 className={styles.title}>Mis entradas</h1>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Próximos ({upcoming.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'past' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Pasados ({past.length})
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <IonSpinner name="crescent" />
          </div>
        ) : !user ? (
          <div className={styles.emptyState}>
            <p>Inicia sesión para ver tus entradas</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className={styles.emptyState}>
            <p>🎟️</p>
            <p>{activeTab === 'upcoming' ? 'No tienes eventos próximos' : 'Sin eventos pasados'}</p>
          </div>
        ) : (
          <div className={styles.list}>
            {displayed.map((ticket) => (
              <div
                key={ticket.id}
                className={styles.ticket}
                onClick={() => history.push(`/app/evento/${ticket.eventId}`)}
              >
                <img src={ticket.eventImage} alt={ticket.eventTitle} className={styles.ticketImage} />
                <div className={styles.ticketInfo}>
                  <span className={styles.ticketBadge}>{ticket.eventCategory.toUpperCase()}</span>
                  <h3 className={styles.ticketTitle}>{ticket.eventTitle}</h3>
                  <p className={styles.ticketDate}>
                    {formatDate(ticket.eventDate)} · {ticket.eventPlace}
                  </p>
                  <p className={styles.ticketQty}>
                    {ticket.quantity} entrada{ticket.quantity > 1 ? 's' : ''}
                  </p>
                </div>
                <button className={styles.qrBtn}>⊞</button>
              </div>
            ))}
          </div>
        )}

        {/* Chats de evento */}
        {displayed.length > 0 && (
          <div className={styles.chatsSection}>
            <p className={styles.chatsLabel}>CHATS DE EVENTO</p>
            {displayed.map((ticket) => (
              <div
                key={ticket.id}
                className={styles.chatItem}
                onClick={() => history.push(`/app/chat/${ticket.eventId}`)}
              >
                <div className={styles.chatIcon}>💬</div>
                <div className={styles.chatInfo}>
                  <p className={styles.chatTitle}>{ticket.eventTitle}</p>
                  <p className={styles.chatSub}>{ticket.eventPlace}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MisEntradas;