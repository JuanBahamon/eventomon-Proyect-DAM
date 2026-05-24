import React from 'react';
import { createRoot } from 'react-dom/client';
import { IonApp, setupIonicReact } from '@ionic/react';
import AppRoutes from './routes/RutasApp';
import { AuthProvider } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';
import { CartProvider } from './context/CartContext';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './theme/global.scss';

setupIonicReact();

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <IonApp>
      <AuthProvider>
        <EventsProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </EventsProvider>
      </AuthProvider>
    </IonApp>
  </React.StrictMode>
);