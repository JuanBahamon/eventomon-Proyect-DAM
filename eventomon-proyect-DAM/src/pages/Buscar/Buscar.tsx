import React, { useState } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useEvents } from '../../context/EventsContext';
import { formatDate } from '../../helpers/FormatDate';
import { formatPrice } from '../../helpers/FormatPrice';
import { useHistory } from 'react-router-dom';
import styles from './Buscar.module.scss';

const CATEGORIES = ['Todo', 'Música', 'Deportes', 'Cultura', 'Nocturna', 'Gastronomía'];
const TRENDS = ['#Jazz', '#Rooftop', '#Cena de autor', '#Indie', '#Arte contemporáneo'];

const Buscar: React.FC = () => {
  const { events, loading } = useEvents();
  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Todo');
  const history = useHistory();

  const filtered = events.filter((e) => {
    const matchCategory = activeCategory === 'Todo' || e.category === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.place.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <IonPage>
      <IonContent className={styles.content}>
        <h1 className={styles.title}>Buscar</h1>

        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Eventos, ciudades, organizadores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.chip} ${activeCategory === cat ? styles.chipActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trends — solo cuando no hay búsqueda */}
        {!search && (
          <div className={styles.trends}>
            <p className={styles.trendsLabel}>TENDENCIAS</p>
            <div className={styles.trendsList}>
              {TRENDS.map((trend) => (
                <button
                  key={trend}
                  className={styles.trendChip}
                  onClick={() => setSearch(trend.replace('#', ''))}
                >
                  {trend}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>
            <IonSpinner name="crescent" color="warning" />
          </div>
        ) : (
          <div className={styles.results}>
            <p className={styles.resultsCount}>{filtered.length} RESULTADOS</p>
            {filtered.map((event) => (
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
                <button className={styles.saveBtn} onClick={(e) => e.stopPropagation()}>🔖</button>
              </div>
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Buscar;