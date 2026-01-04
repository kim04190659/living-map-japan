"use client";

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// ================================
// Types
// ================================

export type CityLayer = '国家コア' | '広域コア' | '準拠点';

export interface City {
  id: string;
  name: string;
  layer: CityLayer;
  primaryRole: string;
  lat: number;
  lng: number;
  horizon: string;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  layerChanges: Record<string, CityLayer>;
}

// ================================
// Design constants
// ================================

const layerColors: Record<CityLayer, string> = {
  '国家コア': '#1e3a8a',
  '広域コア': '#166534',
  '準拠点': '#4b5563'
};

const diffColor = '#dc2626';

// ================================
// Page
// ================================

export default function Page() {
  const [cities, setCities] = useState<City[]>([]);
  const [scenario, setScenario] = useState<'before' | 'after'>('before');
  const [scenarioData, setScenarioData] = useState<Scenario | null>(null);
  const [filters, setFilters] = useState<Record<CityLayer, boolean>>({
    '国家コア': true,
    '広域コア': true,
    '準拠点': true
  });

  useEffect(() => {
    fetch('/data/cities.json').then(r => r.json()).then(setCities);
    fetch('/data/scenario.json').then(r => r.json()).then(setScenarioData);
  }, []);

  const toggle = (layer: CityLayer) =>
    setFilters(prev => ({ ...prev, [layer]: !prev[layer] }));

  const displayedCities = cities.map(city => {
    if (scenario === 'after' && scenarioData?.layerChanges[city.id]) {
      return { ...city, layer: scenarioData.layerChanges[city.id] };
    }
    return city;
  });

  const diffMap: Record<string, boolean> = {};
  if (scenario === 'after' && scenarioData) {
    cities.forEach(c => {
      if (scenarioData.layerChanges[c.id] && scenarioData.layerChanges[c.id] !== c.layer) {
        diffMap[c.id] = true;
      }
    });
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Living Map Japan</h1>

      <button
        className="mb-4 px-3 py-1 border rounded"
        onClick={() => setScenario(s => (s === 'before' ? 'after' : 'before'))}
      >
        シナリオ切替: {scenario}
      </button>

      <Map cities={displayedCities} filters={filters} diffMap={diffMap} />
    </main>
  );
}

// ================================
// Map Component（SSR安全版）
// ================================

function Map({
  cities,
  filters,
  diffMap
}: {
  cities: City[];
  filters: Record<CityLayer, boolean>;
  diffMap: Record<string, boolean>;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let map: any;
    let L: any;

    (async () => {
      L = await import('leaflet');

      map = L.map('map').setView([36.2048, 138.2529], 5);

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
    })();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [cities, filters, diffMap]);

  return <div id="map" style={{ height: '500px' }} />;
}
