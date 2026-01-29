import { Location } from '@/types';

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        });
      },
      (error) => {
        // Fallback to default location (Delhi, India) if geolocation fails
        console.warn('Geolocation error:', error.message);
        resolve({
          lat: 28.6139,
          lng: 77.2090,
          timestamp: Date.now(),
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

export const calculateDistance = (loc1: Location, loc2: Location): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const lat1 = toRad(loc1.lat);
  const lat2 = toRad(loc2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const calculateETA = (distance: number, speed: number = 40): number => {
  // speed in km/h, returns minutes
  return Math.ceil((distance / speed) * 60);
};

export const generateRoute = (from: Location, to: Location): Location[] => {
  // Simple linear interpolation for route visualization
  const steps = 20;
  const route: Location[] = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    route.push({
      lat: from.lat + (to.lat - from.lat) * t,
      lng: from.lng + (to.lng - from.lng) * t,
      timestamp: Date.now(),
    });
  }
  
  return route;
};
