"use client";

import WorldMap, { type MapRegion } from "@/components/ui/world-map";
import { TextureCardStyled } from "@/components/ui/texture-card";

/** Recorte del mapa a Latinoamérica. */
const LATAM_REGION: MapRegion = {
  lat: { min: -57, max: 34 },
  lng: { min: -120, max: -32 },
};

const capitals = {
  santiago: { lat: -33.45, lng: -70.66, label: "Santiago" },
  cdmx: { lat: 19.43, lng: -99.13, label: "CDMX" },
  bogota: { lat: 4.71, lng: -74.07, label: "Bogotá" },
  lima: { lat: -12.04, lng: -77.03, label: "Lima" },
  brasilia: { lat: -15.79, lng: -47.89, label: "Brasília" },
  buenosaires: {
    lat: -34.6,
    lng: -58.38,
    label: "Buenos Aires",
    labelSide: "left" as const,
  },
  montevideo: { lat: -34.9, lng: -56.16, label: "Montevideo" },
};

/** Red de conexiones: Santiago como hub del demo + enlaces regionales. */
const connections = [
  { start: capitals.santiago, end: capitals.cdmx },
  { start: capitals.santiago, end: capitals.bogota },
  { start: capitals.bogota, end: capitals.lima },
  { start: capitals.santiago, end: capitals.brasilia },
  { start: capitals.santiago, end: capitals.buenosaires },
  { start: capitals.buenosaires, end: capitals.montevideo },
];

export function LatamConnectionsMap() {
  return (
    <TextureCardStyled className="h-full">
      <div className="flex h-full flex-col rounded-[20px] bg-white p-5">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-semibold text-neutral-900">
              Cobertura LATAM
            </h3>
            <p className="mt-0.5 text-[12.5px] text-neutral-500">
              Un mismo flujo, conectado a las fuentes de cada país.
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] text-neutral-600">
            <span className="size-1.5 rounded-full bg-indigo-600" aria-hidden />
            7 países
          </span>
        </div>

        <div className="mx-auto mt-4 w-full max-w-[520px] flex-1">
          <WorldMap
            region={LATAM_REGION}
            dots={connections}
            lineColor="#4F46E5"
            dotColor="#9BA3BC66"
            loop
            showLabels
          />
        </div>
      </div>
    </TextureCardStyled>
  );
}
