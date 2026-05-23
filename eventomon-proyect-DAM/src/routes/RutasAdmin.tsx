import React from 'react';
import { IonRouterOutlet, IonPage, IonContent } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';

const PanelAdmin: React.FC = () => (
  <IonPage>
    <IonContent>
      <p style={{ color: 'white', padding: 32 }}>Panel Admin (próximamente)</p>
    </IonContent>
  </IonPage>
);

const RutasAdmin: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="/admin/panel" component={PanelAdmin} exact />
      <Redirect exact from="/admin" to="/admin/panel" />
    </IonRouterOutlet>
  );
};

export default RutasAdmin;