"use client";

import * as React from "react";
import { CircleCheck, Search } from "lucide-react";

import { TextureButton } from "@/components/ui/texture-button";
import { TextureCardStyled } from "@/components/ui/texture-card";
import { connections } from "@/data/connections";
import { cn } from "@/lib/utils";

export function ConnectionsGrid() {
  const [query, setQuery] = React.useState("");
  const [connected, setConnected] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(connections.map((c) => [c.id, c.connected])),
  );

  const filtered = connections.filter((connection) =>
    `${connection.name} ${connection.category} ${connection.countries.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <label className="relative block max-w-xs">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-neutral-500"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar conexión"
          className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-9 pr-3 text-[13px] text-neutral-800 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </label>

      {filtered.length === 0 ? (
        <TextureCardStyled>
          <div className="rounded-[20px] bg-white p-10 text-center text-[13px] text-neutral-500">
            No hay conexiones que coincidan con “{query}”. Prueba con el nombre
            de la fuente o el código del país.
          </div>
        </TextureCardStyled>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((connection) => {
            const isConnected = connected[connection.id];
            return (
              <TextureCardStyled key={connection.id}>
                <div className="flex h-full flex-col gap-4 rounded-[20px] bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 font-mono text-[11px] font-medium text-indigo-700">
                        {connection.countries[0] === "LATAM"
                          ? "LA"
                          : connection.countries[0]}
                      </span>
                      <div>
                        <h3 className="text-[14px] font-semibold leading-snug text-neutral-900">
                          {connection.name}
                        </h3>
                        <p className="text-[12px] text-neutral-500">
                          {connection.category} ·{" "}
                          {connection.countries.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-[12px]",
                        isConnected ? "text-emerald-700" : "text-neutral-500",
                      )}
                    >
                      {isConnected && (
                        <CircleCheck className="size-3.5" aria-hidden />
                      )}
                      {isConnected ? "Conectada" : "Disponible"}
                    </span>
                    {!isConnected && (
                      <div className="w-28">
                        <TextureButton
                          variant="accent"
                          size="sm"
                          onClick={() =>
                            setConnected((prev) => ({
                              ...prev,
                              [connection.id]: true,
                            }))
                          }
                        >
                          Conectar
                        </TextureButton>
                      </div>
                    )}
                  </div>
                </div>
              </TextureCardStyled>
            );
          })}
        </div>
      )}
    </div>
  );
}
