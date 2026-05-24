import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCw5IvhxlO5Sy6p2Mt0pdI7ixubjlPmGGY',
  authDomain: 'event-proyect-dam.firebaseapp.com',
  databaseURL: 'https://event-proyect-dam-default-rtdb.firebaseio.com',
  projectId: 'event-proyect-dam',
  storageBucket: 'event-proyect-dam.firebasestorage.app',
  messagingSenderId: '184894414816',
  appId: '1:184894414816:web:8771a1fe1b5a5ba9f61585'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;