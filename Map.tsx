import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, EmergencyRequest, RescueVehicle } from '@/types';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: Location;
  zoom?: number;
  markers?: Array<{
    location: Location;
    type: 'user' | 'rescue' | 'base';
    label?: string;
  }>;
  requests?: EmergencyRequest[];
  vehicles?: RescueVehicle[];
  showRoute?: boolean;
  className?: string;
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom = 13,
  markers = [],
  requests = [],
  vehicles = [],
  showRoute = false,
  className = '',
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([center.lat, center.lng], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.Polyline) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add base icon
    const baseIcon = L.divIcon({
      html: `<div style="background: #10b981; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
        <span style="color: white; font-size: 20px;">🏢</span>
      </div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Add SOS markers from requests
    requests.forEach((request) => {
      const color = 
        request.priority === 'critical' ? '#dc2626' :
        request.priority === 'high' ? '#ea580c' :
        request.priority === 'medium' ? '#f59e0b' : '#84cc16';

      const icon = L.divIcon({
        html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); animation: pulse 2s infinite;">
          <span style="color: white; font-size: 16px; font-weight: bold;">SOS</span>
        </div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([request.location.lat, request.location.lng], { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <div style="font-weight: bold; margin-bottom: 4px; color: ${color};">
              ${request.type.toUpperCase()} REQUEST
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              Priority: ${request.priority}
            </div>
            <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
              Status: ${request.status}
            </div>
            ${request.customMessage ? `<div style="font-size: 12px; margin-top: 8px; padding: 8px; background: #f3f4f6; border-radius: 4px;">${request.customMessage}</div>` : ''}
          </div>
        `)
        .addTo(mapRef.current!);
    });

    // Add rescue vehicles
    vehicles.forEach((vehicle) => {
      const vehicleIcon = L.divIcon({
        html: `<div style="background: #3b82f6; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          <span style="color: white; font-size: 18px;">${vehicle.type === 'ambulance' ? '🚑' : '🚚'}</span>
        </div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([vehicle.location.lat, vehicle.location.lng], { icon: vehicleIcon })
        .bindPopup(`
          <div style="min-width: 150px;">
            <div style="font-weight: bold; margin-bottom: 4px;">
              ${vehicle.name}
            </div>
            <div style="font-size: 12px; color: #666;">
              Status: ${vehicle.status}
            </div>
          </div>
        `)
        .addTo(mapRef.current!);

      // Draw route if vehicle is deployed
      if (vehicle.currentRoute && vehicle.currentRoute.length > 0 && showRoute) {
        const routeCoords: [number, number][] = vehicle.currentRoute.map((loc) => [loc.lat, loc.lng]);
        L.polyline(routeCoords, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10',
        }).addTo(mapRef.current!);
      }
    });

    // Add custom markers
    markers.forEach((marker) => {
      let icon;
      if (marker.type === 'base') {
        L.marker([marker.location.lat, marker.location.lng], { icon: baseIcon })
          .bindPopup(marker.label || 'Base Station')
          .addTo(mapRef.current!);
        return;
      } else if (marker.type === 'user') {
        icon = L.divIcon({
          html: `<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            <span style="color: white; font-size: 18px;">📍</span>
          </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
      } else {
        icon = L.divIcon({
          html: `<div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            <span style="color: white; font-size: 18px;">🚁</span>
          </div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
      }

      L.marker([marker.location.lat, marker.location.lng], { icon })
        .bindPopup(marker.label || '')
        .addTo(mapRef.current!);
    });

    // Center map on first request or center prop
    if (requests.length > 0) {
      mapRef.current.setView([requests[0].location.lat, requests[0].location.lng], zoom);
    } else {
      mapRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, markers, requests, vehicles, showRoute]);

  return (
    <div ref={mapContainerRef} className={`w-full h-full rounded-xl overflow-hidden ${className}`}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};
