"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";

// ================================
// Types
// ================================

type CityLayer = "国家コア" | "広域コア" | "準拠点";

interface City {
  id: string;
  name: string;
  layer: CityLayer;
  primaryRole: string;
  policyMeaning: string;
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
// Constants
// ================================

const layerColors: Record<CityLayer, string> = {
  国家コア: "#1e3a8a",
  広域コア: "#166534",
  準拠点: "#4b5563",
};

const diffColor = "#dc2626";

// ================================
// Page
// ================================

export default function Page() {
  const [cities, setCities] = useState<City[]>([]);
  const [scenarioKey, setScenarioKey] = useState<"before" | "g1" | "g2" | "g3">(
    "before"
  );
  const [scenarios, setScenarios] = useState<Record<string, Scenario>>({});
  const [filters, setFilters] = useState<Record<CityLayer, boolean>>({
    国家コア: true,
    広域コア: true,
    準拠点: true,
  });

  // ----------------
  // Load JSON
  // ----------------
  useEffect(() => {
    fetch("/data/cities.json").then((r) => r.json()).then(setCities);

    Promise.all([
      fetch("/data/scenario-g1.json").then((r) => r.json()),
      fetch("/data/scenario-g2.json").then((r) => r.json()),
      fetch("/data/scenario-g3.json").then((r) => r.json()),
    ]).then(([g1, g2, g3]) =>
      setScenarios({ g1, g2, g3 })
    );
  }, []);

  // ----------------
  // Apply scenario
  // ----------------
  const appliedCities = cities.map((c) => {
    if (scenarioKey !== "before") {
      const next = scenarios[scenarioKey]?.layerChanges[c.id];
      if (next) return { ...c, layer: next };
    }
    return c;
  });

  const diffMap: Record<string, boolean> = {};
  if (scenarioKey !== "before") {
    cities.forEach((c) => {
      const next = scenarios[scenarioKey]?.layerChanges[c.id];
      if (next && next !== c.layer) diffMap[c.id] = true;
    });
  }

  // ----------------
  // UI
  // ----------------
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">Living Map Japan</h1>
      <p className="text-sm text-gray-600 mb-4">
        都市再編シナリオ可視化（G-1 / G-2 / G-3）
      </p>

      {/* Scenario selector */}
      <div className="flex gap-2 mb-4">
        {[
          ["before", "Before"],
          ["g1", "G-1 集約型"],
          ["g2", "G-2 連邦型"],
          ["g3", "G-3 分散型"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setScenarioKey(key as any)}
            className={`px-3 py-1 border rounded ${
              scenarioKey === key ? "bg-black text-white" : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 text-sm">
        {(Object.keys(filters) as CityLayer[]).map((l) => (
          <label key={l} className="flex gap-1 items-center">
            <input
              type="checkbox"
              checked={filters[l]}
              onChange={() =>
                setFilters((p) => ({ ...p, [l]: !p[l] }))
              }
            />
            {l}
          </label>
        ))}
      </div>

      <Map cities={appliedCities} filters={filters} diffMap={diffMap} />
    </main>
  );
}

// ================================
// Map Component
// ================================

function Map({
  cities,
  filters,
  diffMap,
}: {
  cities: City[];
  filters: Record<CityLayer, boolean>;
  diffMap: Record<string, boolean>;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const map = L.map("map").setView([36.2048, 138.2529], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    cities
      .filter((c) => filters[c.layer])
      .forEach((c) => {
        const isDiff = diffMap[c.id];
        L.circleMarker([c.lat, c.lng], {
          radius: isDiff ? 10 : 8,
          color: isDiff ? diffColor : layerColors[c.layer],
          fillColor: isDiff ? diffColor : layerColors[c.layer],
          fillOpacity: 0.85,
        })
          .addTo(map)
          .bindPopup(
            `<strong>${c.name}</strong><br/>
             <b>${c.layer}</b><br/>
             ${c.primaryRole}<br/>
             <small>${c.policyMeaning}</small><br/>
             <small>${c.horizon}</small>`
          );
      });

    return () => map.remove();
  }, [cities, filters, diffMap]);

  return <div id="map" className="h-[520px] w-full border rounded" />;
}

