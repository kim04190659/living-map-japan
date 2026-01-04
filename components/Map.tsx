"use client";

import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';
import type { City, CityLayer } from '@/types/city';

const layerColors: Record<CityLayer, string> = {
  '国家コア': '#1e3a8a',
  '広域コア': '#166534',
  '準拠点': '#4b5563'
};

const diffColor = '#dc2626';

export default function Map({
  cities,
  filters,
  diffMap
}: {
  cities: City[];
  filters: Record<CityLayer, boolean>;
  diffMap: Record<string, boolean>;
}) {
  useEffect(() => {
    const map = L.map('map').setView([36.2048, 138.2529], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    cities
      .filter(c => filters[c.layer])
      .forEach(c => {
        const isDiff = diffMap[c.id];
        L.circleMarker([c.lat, c.lng], {
          radius: isDiff ? 10 : 8,
          color: isDiff ? diffColor : layerColors[c.layer],
          fillColor: isDiff ? diffColor : layerColors[c.layer],
          fillOpacity: 0.85
        })
          .addTo(map)
          .bindPopup(
            `<strong>${c.name}</strong><br/>${c.primaryRole}<br/><small>${c.horizon}</small>`
          );
      });

    // ★ ここが重要：必ず void を返す
    return () => {
      map.remove();
    };
  }, [cities, filters, diffMap]);

  return <div id="map" style={{ height: '500px' }} />;
}
