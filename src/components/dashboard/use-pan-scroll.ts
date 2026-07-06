"use client";

import * as React from "react";

/**
 * Paneo del lienzo con clic sostenido: arrastrar el fondo desplaza el
 * scroll horizontal del contenedor, como en Figma o Miro. Ignora los
 * arrastres que empiezan sobre una tarjeta (data-canvas-card) o un
 * control, para no pelear con el drag de las tarjetas.
 */
export function usePanScroll<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [panning, setPanning] = React.useState(false);
  const session = React.useRef<{
    pointerId: number;
    startX: number;
    startLeft: number;
  } | null>(null);

  const handlers = {
    onPointerDown: (event: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || event.button !== 0) return;
      const target = event.target as HTMLElement;
      if (target.closest("[data-canvas-card], button, a, input")) return;
      // Sin desborde no hay nada que panear.
      if (el.scrollWidth <= el.clientWidth) return;

      el.setPointerCapture(event.pointerId);
      session.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startLeft: el.scrollLeft,
      };
      setPanning(true);
    },
    onPointerMove: (event: React.PointerEvent<T>) => {
      const el = ref.current;
      const pan = session.current;
      if (!el || !pan || pan.pointerId !== event.pointerId) return;
      el.scrollLeft = pan.startLeft - (event.clientX - pan.startX);
    },
    onPointerUp: (event: React.PointerEvent<T>) => {
      if (session.current?.pointerId === event.pointerId) {
        session.current = null;
        setPanning(false);
      }
    },
    onPointerCancel: () => {
      session.current = null;
      setPanning(false);
    },
  };

  return { ref, handlers, panning };
}
