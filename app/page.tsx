"use client";

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
// Design constants (B / I)
// ================================

const layerColors: Record<CityLayer, string> = {
  '国家コア': '#1e3a8a',
  '広域コア': '#166534',
  '準拠点': '#4b5563'
};

const diffColor = '#dc2626'; // 赤（Afterで変化した都市）

const layerLabels: Record<CityLayer, string> = {
  '国家コア': '国家機能を集約する中枢都市',
  '広域コア': '複数県を支える広域拠点',
  '準拠点': '生活完結を保証する最低基盤'
};

// ================================
// Page (J-2 + I)
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

  // J-2: JSON 読み込み
  useEffect(() => {
    fetch('/data/cities.json').then(r => r.json()).then(setCities);
    fetch('/data/scenario.json').then(r => r.json()).then(setScenarioData);
  }, []);

  const toggle = (layer: CityLayer) =>
    setFilters(prev => ({ ...prev, [layer]: !prev[layer] }));

  // I: Before / After 差分適用
  const displayedCities = cities.map(city => {
    if (scenario === 'after' && scenarioData?.layerChanges[city.id]) {
      return {
        ...city,
        layer: scenarioData.layerChanges[city.id]
      };
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
      <h1 className="text-2xl font-bold mb-2">未来のくらし設計図（Living Map Japan）</h1>
      <p className="text-sm text-gray-600 mb-4">都市再編 Before / After 可視化</p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        {(Object.keys(layerColors) as CityLayer[]).map(layer => (
          <div key={layer} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: layerColors[layer] }}
            />
            <span>{layer}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: diffColor }}
          />
          <span>Afterで変化</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {(Object.keys(filters) as CityLayer[]).map(layer => (
          <label key={layer} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters[layer]}
              onChange={() => toggle(layer)}
            />
            {layer}
          </label>
        ))}
      </div>

      <button
        className="mb-4 px-3 py-1 border rounded"
        onClick={() => setScenario(s => s === 'before' ? 'after' : 'before')}
      >
        シナリオ切替: {scenario === 'before' ? 'Before' : 'After'}
      </button>

      <Map cities={displayedCities} filters={filters} diffMap={diffMap} />
    </main>
  );
}

// ================================
// Map Component (I 完成形)
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
    const map = L.map('map').setView([36.2048, 138.2529], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    cities
      .filter(c => filters[c.layer])
      .forEach(c => {
        const isDiff = diffMap[c.id];
        const marker = L.circleMarker([c.lat, c.lng], {
          radius: isDiff ? 10 : 8,
          color: isDiff ? diffColor : layerColors[c.layer],
          fillColor: isDiff ? diffColor : layerColors[c.layer],
          fillOpacity: 0.85
        });

        marker
          .addTo(map)
          .bindPopup(
            `<strong>${c.name}</strong><br/>${c.primaryRole}<br/><small>${c.horizon}</small>`
          );
      });

    return () => map.remove();
  }, [cities, filters, diffMap]);

  return <div id="map" style={{ height: '500px' }} />;
}
