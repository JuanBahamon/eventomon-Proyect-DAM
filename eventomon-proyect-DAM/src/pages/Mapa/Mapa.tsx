import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useHistory } from 'react-router-dom';
import { useGeolocation } from '../../Hooks/UseGeolocation';
import { useEvents, Event } from '../../context/EventsContext';
import { formatDate } from '../../helpers/FormatDate';
import { formatPrice } from '../../helpers/FormatPrice';
import 'leaflet/dist/leaflet.css';
import styles from './Mapa.module.scss';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const eventIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

const Mapa: React.FC = () => {
  const { coordinates, loading: loadingGeo } = useGeolocation();
  const { events, loading: loadingEvents } = useEvents();
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const history = useHistory();
  const loading = loadingGeo || loadingEvents;

  return (
    <IonPage>
      <IonContent className={styles.content} scrollY={false}>
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <p className={styles.headerLabel}>EVENTOS</p>
            <h2 className={styles.headerTitle}>Cerca de ti</h2>
          </div>
          <button className={styles.filterBtn}>⚙️</button>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <IonSpinner name="crescent" color="warning" />
          </div>
        ) : (
          <>
            <div className={styles.mapContainer}>
              <MapContainer
                center={[coordinates?.lat ?? 40.4168, coordinates?.lng ?? -3.7038]}
                zoom={13}
                className={styles.map}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                {coordinates && <CenterMap lat={coordinates.lat} lng={coordinates.lng} />}
                {coordinates && (
                  <Marker position={[coordinates.lat, coordinates.lng]} icon={userIcon}>
                    <Popup>Tu ubicación</Popup>
                  </Marker>
                )}
                {events.map((event) => (
                  <Marker
                    key={event.id}
                    position={[event.lat, event.lng]}
                    icon={eventIcon}
                    eventHandlers={{ click: () => setActiveEvent(event) }}
                  />
                ))}
              </MapContainer>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHandle} />
              <p className={styles.panelTitle}>{events.length} EVENTOS CERCA</p>

              <div className={styles.eventsList}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`${styles.miniCard} ${activeEvent?.id === event.id ? styles.miniCardActive : ''}`}
                    onClick={() => setActiveEvent(event)}
                  >
                    <img src={event.image} alt={event.title} className={styles.miniCardImage} />
                    <div className={styles.miniCardOverlay}>
                      <span className={styles.miniCardTag}>{event.category.toUpperCase()}</span>
                      <h3 className={styles.miniCardTitle}>{event.title}</h3>
                      <p className={styles.miniCardInfo}>{formatDate(event.date)} · {event.city}</p>
                      <p className={styles.miniCardPrice}>{formatPrice(event.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {activeEvent && (
                <p
                  className={styles.activePin}
                  onClick={() => history.push(`/app/evento/${activeEvent.id}`)}
                >
                  Pin activo: <span className={styles.activePinName}>{activeEvent.title}</span>
                </p>
              )}
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Mapa;