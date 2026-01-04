export type CityLayer = "国家コア" | "広域コア" | "準拠点";

export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  layer: CityLayer;
  primaryRole: string;
  horizon: string;
}
