"use client";

import { useEffect } from "react";
import L from "leaflet";
import type { City, CityLayer } from "../app/page";

export default function Map({
  cities,
  filters,
  supportByLayer
}: {
  cities: City[];
  filters: Record<CityLayer, boolean>;
  supportByLayer: Record<CityLayer, string[]>;
}) {
  useEffect(() => {
    const map = L.map("map").setView([36.2048, 138.2529], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    cities
      .filter(c => filters[c.layer])
      .forEach(c => {
        const supportHtml = supportByLayer[c.layer]
          .map(s => `<li>${s}</li>`)
          .join("");

        L.marker([c.lat, c.lng])
          .addTo(map)
          .bindPopup(
            `<strong>${c.name}</strong><br/>
             ${c.primaryRole}<br/><br/>
             <em>国の支援</em>
             <ul>${supportHtml}</ul>`
          );
      });

    return () => map.remove();
  }, [cities, filters, supportByLayer]);

  return <div id="map" style={{ height: "500px" }} />;
}
