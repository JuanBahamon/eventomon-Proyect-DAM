import React, { useState } from 'react';
import { IonPage, IonContent, IonSearchbar, IonChip, IonSpinner, IonIcon } from '@ionic/react';
import { notificationsOutline, qrCodeOutline } from 'ionicons/icons';
import { useEvents, Event } from '../../context/EventsContext';
import { formatDate } from '../../helpers/FormatDate';
import { formatPrice } from '../../helpers/FormatPrice';
import { useHistory } from 'react-router-dom';
import styles from './Inicio.module.scss';

const CATEGORIES = ['All', 'Música', 'Deportes', 'Cultura', 'Nocturna', 'Gastronomía'];

const Inicio: React.FC = () => {
  const { events, loading } = useEvents();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const history = useHistory();

  const filtered = events.filter((e) => {
    const matchCategory = activeCategory === 'All' || e.category === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featured = events.find((e) => e.featured);
  const nearby = filtered.filter((e) => !e.featured);

  return (
    <IonPage>
      <IonContent className={styles.content}>

        <div className={styles.header}>
          <div>
            <p className={styles.city}>MADRID · TODAY</p>
            <h1 className={styles.title}>
              Discover <span className={styles.brand}>EVNT</span>
            </h1>
          </div>
          <button className={styles.notifBtn}>
            <IonIcon icon={notificationsOutline} />
            <span className={styles.badge} />
          </button>
        </div>

        <div className={styles.searchContainer}>
          <IonSearchbar
            className={styles.searchbar}
            placeholder="Search events, artists, places..."
            value={search}
            onIonInput={(e) => setSearch(e.detail.value ?? '')}
          />
        </div>

        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <IonChip
              key={cat}
              className={`${styles.chip} ${activeCategory === cat ? styles.chipActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </IonChip>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>
            <IonSpinner name="crescent" color="warning" />
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <div
                className={styles.featured}
                onClick={() => history.push(`/app/evento/${featured.id}`)}
              >
                <img src={featured.image} alt={featured.title} className={styles.featuredImage} />
                <div className={styles.featuredOverlay}>
                  <div className={styles.featuredTags}>
                    <span className={styles.tagFeatured}>FEATURED</span>
                    <span className={styles.tagCategory}>{featured.category.toUpperCase()}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  <div className={styles.featuredFooter}>
                    <span className={styles.featuredDate}>
                      {formatDate(featured.date)} · {featured.city}
                    </span>
                    <span className={styles.featuredPrice}>
                      from {formatPrice(featured.price)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Nearby */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Upcoming near you</h2>
                <span className={styles.seeAll}>SEE ALL</span>
              </div>
              {nearby.map((event) => (
                <div
                  key={event.id}
                  className={styles.card}
                  onClick={() => history.push(`/app/evento/${event.id}`)}
                >
                  <img src={event.image} alt={event.title} className={styles.cardImage} />
                  <div className={styles.cardInfo}>
                    <span className={styles.cardTag}>{event.category.toUpperCase()}</span>
                    <h3 className={styles.cardTitle}>{event.title}</h3>
                    <p className={styles.cardDetail}>📅 {formatDate(event.date)} · {event.time}</p>
                    <p className={styles.cardDetail}>📍 {event.place}</p>
                    <p className={styles.cardPrice}>{formatPrice(event.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* FAB Scanner */}
        <button
          className={styles.fab}
          onClick={() => history.push('/app/escaner')}
        >
          <IonIcon icon={qrCodeOutline} />
        </button>

      </IonContent>
    </IonPage>
  );
};

export default Inicio;