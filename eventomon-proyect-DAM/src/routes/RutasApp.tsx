import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';

import Ingreso from '../pages/Ingreso/Ingreso';
import Registro from '../pages/Registro/Registro';
import RutasUsuario from './RutasUsuario';
import RutasAdmin from './RutasAdmin';

const RutasApp: React.FC = () => {
    return (
        <IonReactRouter>
            <IonRouterOutlet id="main">
                <Route path="/ingreso" component={Ingreso} exact />
                <Route path="/registro" component={Registro} exact />
                <Route path="/app" render={() => <RutasUsuario />} />
                <Route path="/admin" render={() => <RutasAdmin />} />
                <Redirect exact from="/" to="/ingreso" />
            </IonRouterOutlet>
        </IonReactRouter>
    );
};

export default RutasApp;