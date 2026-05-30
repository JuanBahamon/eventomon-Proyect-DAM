import React from 'react';
import { IonRouterOutlet, IonPage, IonContent } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import AdminEventos from '../pages/Admin/AdminEventos';

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
            <Route exact path="/admin/eventos" component={AdminEventos} />
            <Route exact path="/admin">
                <Redirect to="/admin/eventos" />
            </Route>
        </IonRouterOutlet>
    );
};

export default RutasAdmin;