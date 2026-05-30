EVNT
Aplicación Móvil de Eventos
Documento Final de Proyecto
Campo	Detalle
Proyecto	EVNT — App de Eventos
Estudiante	Juan José Bahamon Lozano
Desarrollo de Aplicaciones Móviles (DAM)
Universidad Autónoma de Occidente

Tecnología	Ionic 7 + React + TypeScript

1. Descripción del Sistema
EVNT es una aplicación móvil desarrollada con Ionic y React que permite a los usuarios descubrir, explorar y gestionar eventos cercanos a su ubicación. La app integra autenticación real con Firebase, chat en tiempo real entre asistentes, mapas interactivos con GPS, escáner QR de entradas y carrito de compras, todo con una interfaz visual de tema oscuro inspirada en el prototipo diseñado en Lovable.

2. Alcance del Sistema
2.1 Autenticación
-	Registro de nuevos usuarios con nombre, correo y contraseña
-	Inicio de sesión con Firebase Authentication
-	Cierre de sesión y persistencia automática de sesión
-	Almacenamiento del perfil de usuario en Firebase Realtime Database

2.2 Pantalla de Inicio
-	Evento destacado con imagen hero y overlay
-	Filtros por categoría: Música, Deportes, Cultura, Nocturna, Gastronomía
-	Buscador de eventos por nombre en tiempo real
-	Lista de eventos próximos cercanos
-	Botón flotante (FAB) de acceso rápido al escáner QR

2.3 Mapa con GPS
-	Mapa interactivo con tema oscuro (CartoDB Dark Matter)
-	Ubicación en tiempo real del usuario mediante GPS con Capacitor Geolocation
-	Marcadores dorados para eventos y azul para el usuario
-	Panel inferior con lista horizontal de eventos cercanos
-	Selección de evento activo con resaltado visual

2.4 Buscar
-	Buscador por nombre, lugar y ciudad
-	Filtros por categoría
-	Sección de tendencias con hashtags
-	Contador de resultados en tiempo real

2.5 Detalle de Evento
-	Vista completa con imagen hero y datos del evento
-	Información de fecha, lugar y número de asistentes
-	Descripción detallada del evento
-	Acceso directo al chat del evento
-	Botón para agregar la entrada al carrito

2.6 Carrito de Entradas
-	Agregar, eliminar y ajustar cantidad de entradas por evento
-	Cálculo automático del total
-	Confirmación de compra (flujo visual)
-	Opción para limpiar el carrito completo

2.7 Mis Entradas
-	Lista de entradas compradas con pestañas Próximos / Pasados
-	Badge VIP o GENERAL por entrada
-	Acceso directo al chat del evento desde la pantalla de entradas

2.8 Chat en Tiempo Real
-	Mensajes sincronizados en tiempo real con Firebase Realtime Database
-	Diferenciación visual entre mensajes propios y de otros usuarios
-	Nombre de usuario y hora de envío en cada mensaje
-	Scroll automático al último mensaje

2.9 Escáner QR
-	Apertura de cámara del dispositivo con Capacitor Camera
-	Animación de línea de escaneo sobre el visor
-	Confirmación visual al escanear una entrada
-	Reset mediante agitación del teléfono gracias al acelerómetro

2.10 Perfil de Usuario
-	Datos del usuario autenticado con inicial como avatar
-	Estadísticas: eventos asistidos, próximos y guardados
-	Menú de opciones: carrito, guardados, métodos de pago, preferencias y ayuda
-	Cierre de sesión

3. Tecnologías Utilizadas
Tecnología	Versión	Uso
Ionic Framework	7	Framework de UI móvil
React	18	Librería de interfaz de usuario
TypeScript	5	Tipado estático
Firebase Auth	10	Autenticación de usuarios
Firebase Realtime DB	10	Base de datos en tiempo real
Capacitor Geolocation	6	Sensor GPS
Capacitor Camera	6	Sensor de cámara / escáner QR
Capacitor Motion	6	Sensor acelerómetro
React Leaflet	4	Mapas interactivos
SCSS Modules	—	Estilos encapsulados por componente

4. APIs y Servicios Externos
Servicio	URL	Uso
Firebase Auth	firebase.google.com	Login y registro de usuarios
Firebase Realtime DB	firebase.google.com	Eventos y chat en tiempo real
CartoDB Dark Matter	basemaps.cartocdn.com	Tiles del mapa con tema oscuro
Leaflet Color Markers	githubusercontent.com	Iconos de marcadores en el mapa
Unsplash	images.unsplash.com	Imágenes de eventos de muestra

5. Sensores del Dispositivo
Sensor	Hook	Uso en la app
GPS	useGeolocation	Ubicar al usuario en el mapa en tiempo real
Cámara	useCamera	Escáner QR para verificación de entradas
Acelerómetro	useAccelerometer	Shake para resetear el escáner QR

6. Estructura del Proyecto
Carpeta / Archivo	Descripción
src/context/AuthContext.tsx	Contexto global de autenticación
src/context/EventsContext.tsx	Contexto de eventos en tiempo real
src/context/CartContext.tsx	Contexto del carrito de entradas
src/helpers/Firebase.ts	Configuración e inicialización de Firebase
src/helpers/FormatDate.ts	Utilidades para formateo de fechas
src/helpers/FormatPrice.ts	Utilidades para formateo de precios
src/Hooks/UseAuth.tsx	Hook de registro e inicio de sesión
src/Hooks/UseGeolocation.ts	Hook de sensor GPS
src/Hooks/UseCamera.ts	Hook de sensor de cámara
src/Hooks/UseAccelerometer.ts	Hook de sensor acelerómetro
src/pages/Inicio/	Pantalla principal con eventos y buscador
src/pages/Mapa/	Mapa interactivo con marcadores GPS
src/pages/Buscar/	Búsqueda y filtrado de eventos
src/pages/DetalleEvento/	Vista completa de un evento
src/pages/Carrito/	Gestión del carrito de entradas
src/pages/MisEntradas/	Entradas del usuario y chats
src/pages/Chat/	Chat en tiempo real por evento
src/pages/Escaner/	Escáner QR con cámara y acelerómetro
src/pages/Perfil/	Perfil y configuración del usuario
src/pages/Ingreso/	Pantalla de inicio de sesión
src/pages/Registro/	Pantalla de registro de usuario
src/routes/AppRoutes.tsx	Rutas raíz de la aplicación
src/routes/UserRoutes.tsx	Rutas protegidas de usuario
src/routes/AdminRoutes.tsx	Rutas de administrador
src/theme/variables.css	Variables de color y diseño globales
src/theme/global.scss	Estilos globales de la aplicación

7. Estructura de Base de Datos
La base de datos utilizada es Firebase Realtime Database con la siguiente estructura de nodos:

Nodo: events
Campo	Descripción
title	Nombre del evento
category	Categoría (Música, Deportes, Cultura, etc.)
date / time	Fecha y hora del evento
place / city	Lugar y ciudad donde se realiza
price	Precio de la entrada
image	URL de la imagen del evento
description	Descripción detallada
attendees	Número de asistentes confirmados
featured	Si es evento destacado (boolean)
lat / lng	Coordenadas para el mapa

Nodo: chats/{eventId}/messages
Campo	Descripción
text	Contenido del mensaje
userId	ID del usuario que envió el mensaje
userName	Nombre visible del usuario
timestamp	Marca de tiempo del envío

Nodo: users/{userId}
Campo	Descripción
name	Nombre completo del usuario
email	Correo electrónico
role	Rol del usuario (user / admin)
premium	Si es miembro premium (boolean)
createdAt	Fecha de registro

8. Historial de Commits
Commit	Descripción
setup: estructura base + rutas + menú	Configuración inicial, rutas y variables de tema
feat: firebase + auth (login/registro)	Integración de Firebase y pantallas de autenticación
feat: home + detalle evento	Pantalla de inicio y vista de detalle de evento
feat: mapa con GPS	Mapa interactivo con Leaflet y sensor GPS
feat: carrito + mis entradas	Gestión de carrito y pantalla de entradas
feat: chat en tiempo real	Chat por evento con Firebase Realtime Database
feat: escáner QR + acelerómetro	Escáner de cámara y sensor de agitación
feat: buscar + perfil	Pantalla de búsqueda y perfil de usuario
fix: textos en español	Corrección de todos los textos visuales al español
feat: detalle evento + README	Pantalla de detalle completa y documentación del repo

