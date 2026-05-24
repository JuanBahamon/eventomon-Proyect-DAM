import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

interface Coordinates {
  lat: number;
  lng: number;
}

interface GeoResult {
  coordinates: Coordinates | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = (): GeoResult => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPosition = async () => {
      try {
        const permission = await Geolocation.requestPermissions();
        if (permission.location !== 'granted') {
          setError('Location permission denied');
          // Fallback Madrid
          setCoordinates({ lat: 40.4168, lng: -3.7038 });
          setLoading(false);
          return;
        }
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } catch (e) {
        setError('Could not get location');
        // Fallback Madrid
        setCoordinates({ lat: 40.4168, lng: -3.7038 });
      } finally {
        setLoading(false);
      }
    };

    getPosition();
  }, []);

  return { coordinates, error, loading };
};