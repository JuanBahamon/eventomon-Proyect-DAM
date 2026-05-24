import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../helpers/Firebase';

export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  place: string;
  city: string;
  price: number;
  image: string;
  description: string;
  attendees: number;
  featured: boolean;
  lat: number;
  lng: number;
}

interface EventsContextType {
  events: Event[];
  loading: boolean;
}

const EventsContext = createContext<EventsContextType>({
  events: [],
  loading: true,
});

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    const unsub = onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Event[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setEvents(list);
      } else {
        setEvents([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);