import React from 'react';
import {
    IonTabs, IonTabBar, IonTabButton,
    IonIcon, IonLabel, IonRouterOutlet
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import {
    homeOutline, mapOutline, searchOutline,
    ticketOutline, personOutline
} from 'ionicons/icons';

import Inicio from '../pages/Inicio/Inicio';
import Mapa from '../pages/Mapa/Mapa';
import Buscar from '../pages/Buscar/Buscar';
import MisEntradas from '../pages/MisEntradas/MisEntradas';
import Perfil from '../pages/Perfil/Perfil';
import DetalleEvento from '../pages/DetalleEvento/DetalleEvento';
import Carrito from '../pages/Carrito/Carrito';
import Chat from '../pages/Chat/Chat';
import Escaner from '../pages/Escaner/Escaner';

const RutasUsuario: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path="/app/inicio" component={Inicio} exact />
                <Route path="/app/mapa" component={Mapa} exact />
                <Route path="/app/buscar" component={Buscar} exact />
                <Route path="/app/entradas" component={MisEntradas} exact />
                <Route path="/app/perfil" component={Perfil} exact />
                <Route path="/app/evento/:id" component={DetalleEvento} exact />
                <Route path="/app/carrito" component={Carrito} exact />
                <Route path="/app/chat/:id" component={Chat} exact />
                <Route path="/app/escaner" component={Escaner} exact />
                <Redirect exact from="/app" to="/app/inicio" />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
                <IonTabButton tab="inicio" href="/app/inicio">
                    <IonIcon icon={homeOutline} />
                    <IonLabel>Inicio</IonLabel>
                </IonTabButton>
                <IonTabButton tab="mapa" href="/app/mapa">
                    <IonIcon icon={mapOutline} />
                    <IonLabel>Mapa</IonLabel>
                </IonTabButton>
                <IonTabButton tab="buscar" href="/app/buscar">
                    <IonIcon icon={searchOutline} />
                    <IonLabel>Buscar</IonLabel>
                </IonTabButton>
                <IonTabButton tab="entradas" href="/app/entradas">
                    <IonIcon icon={ticketOutline} />
                    <IonLabel>Tickets</IonLabel>
                </IonTabButton>
                <IonTabButton tab="perfil" href="/app/perfil">
                    <IonIcon icon={personOutline} />
                    <IonLabel>Perfil</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default RutasUsuario;