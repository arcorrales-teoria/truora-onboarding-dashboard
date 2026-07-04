"use client";

import * as React from "react";
import { GripVertical, Info } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { TextureCardStyled } from "@/components/ui/texture-card";
import { validationProducts } from "@/data/products";
import { cn } from "@/lib/utils";

import { productIcons } from "./icons";

export function ProductBlocks() {
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(validationProducts.map((p) => [p.id, p.enabled])),
  );

  const activeCount = Object.values(enabled).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <p className="text-[12.5px] text-neutral-500">
        <span className="font-mono text-neutral-700">{activeCount}</span> de{" "}
        <span className="font-mono text-neutral-700">
          {validationProducts.length}
        </span>{" "}
        bloques activos en este flujo. Arrastra para reordenar el recorrido.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {validationProducts.map((product) => {
          const Icon = productIcons[product.icon];
          const isOn = enabled[product.id];
          return (
            <TextureCardStyled key={product.id}>
              <div
                className={cn(
                  "flex h-full items-start gap-3 rounded-[20px] bg-white p-4 transition-opacity",
                  !isOn && "opacity-70",
                )}
              >
                <GripVertical
                  className="mt-0.5 size-4 shrink-0 cursor-grab text-neutral-300"
                  aria-hidden
                />
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-[10px] transition-colors",
                    isOn
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-neutral-100 text-neutral-500",
                  )}
                >
                  <Icon className="size-4.5" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="flex items-center gap-1 text-[13.5px] font-semibold leading-snug text-neutral-900">
                      {product.name}
                      <Info
                        className="size-3 shrink-0 text-neutral-300"
                        aria-hidden
                      />
                    </h4>
                    <Switch
                      checked={isOn}
                      onCheckedChange={(checked) =>
                        setEnabled((prev) => ({
                          ...prev,
                          [product.id]: checked === true,
                        }))
                      }
                      aria-label={`${isOn ? "Desactivar" : "Activar"} ${product.name}`}
                    />
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-neutral-500">
                    {product.description}
                  </p>
                </div>
              </div>
            </TextureCardStyled>
          );
        })}
      </div>
    </div>
  );
}
