import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { trashOutline, addOutline, removeOutline } from 'ionicons/icons';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../helpers/FormatPrice';
import { useHistory } from 'react-router-dom';
import styles from './Carrito.module.scss';

const Carrito: React.FC = () => {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, total } = useCart();
  const history = useHistory();

  const handleConfirm = () => {
    clearCart();
    history.replace('/app/entradas');
  };

  return (
    <IonPage>
      <IonContent className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mi carrito</h1>
          {items.length > 0 && (
            <button className={styles.clearBtn} onClick={clearCart}>
              Limpiar todo
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🎟️</p>
            <p className={styles.emptyText}>Tu carrito está vacío</p>
            <IonButton className={styles.exploreBtn} onClick={() => history.push('/app/inicio')}>
              Explorar eventos
            </IonButton>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {items.map((item) => (
                <div key={item.event.id} className={styles.card}>
                  <img src={item.event.image} alt={item.event.title} className={styles.cardImage} />
                  <div className={styles.cardInfo}>
                    <span className={styles.cardTag}>{item.event.category.toUpperCase()}</span>
                    <h3 className={styles.cardTitle}>{item.event.title}</h3>
                    <p className={styles.cardDate}>{item.event.date} · {item.event.place}</p>
                    <p className={styles.cardPrice}>{formatPrice(item.event.price * item.quantity)}</p>
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.actionBtn} onClick={() => removeFromCart(item.event.id)}>
                      <IonIcon icon={trashOutline} />
                    </button>
                    <div className={styles.quantity}>
                      <button className={styles.qtyBtn} onClick={() => decreaseQuantity(item.event.id)}>
                        <IonIcon icon={removeOutline} />
                      </button>
                      <span className={styles.qtyNum}>{item.quantity}</span>
                      <button className={styles.qtyBtn} onClick={() => increaseQuantity(item.event.id)}>
                        <IonIcon icon={addOutline} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerRow}>
                <span className={styles.footerLabel}>Total</span>
                <span className={styles.footerTotal}>{formatPrice(total)}</span>
              </div>
              <IonButton className={styles.confirmBtn} expand="block" onClick={handleConfirm}>
                Confirmar compra
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Carrito;