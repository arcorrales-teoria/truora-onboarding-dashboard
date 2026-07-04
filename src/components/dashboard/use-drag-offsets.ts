"use client";

import * as React from "react";

export interface Offset {
  x: number;
  y: number;
}

/**
 * Arrastre de tarjetas dentro de un lienzo escalado: devuelve el
 * desplazamiento acumulado por id y los handlers de pointer para el
 * elemento arrastrable. El delta se divide por la escala del lienzo
 * para que la tarjeta siga exactamente al cursor.
 */
export function useDragOffsets(scale: number) {
  const [offsets, setOffsets] = React.useState<Record<string, Offset>>({});
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const session = React.useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    base: Offset;
  } | null>(null);

  const handlersFor = React.useCallback(
    (id: string) => ({
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        // Solo botón principal; no interceptar clics en controles internos.
        if (event.button !== 0) return;
        const target = event.target as HTMLElement;
        if (target.closest("button, a, input, [role='switch']")) return;

        event.currentTarget.setPointerCapture(event.pointerId);
        session.current = {
          id,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          base: offsets[id] ?? { x: 0, y: 0 },
        };
        setDraggingId(id);
      },
      onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
        const drag = session.current;
        if (!drag || drag.id !== id || drag.pointerId !== event.pointerId) {
          return;
        }
        const dx = (event.clientX - drag.startX) / scale;
        const dy = (event.clientY - drag.startY) / scale;
        setOffsets((prev) => ({
          ...prev,
          [id]: { x: drag.base.x + dx, y: drag.base.y + dy },
        }));
      },
      onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
        if (session.current?.pointerId === event.pointerId) {
          session.current = null;
          setDraggingId(null);
        }
      },
      onPointerCancel: () => {
        session.current = null;
        setDraggingId(null);
      },
    }),
    [offsets, scale],
  );

  const offsetOf = React.useCallback(
    (id: string): Offset => offsets[id] ?? { x: 0, y: 0 },
    [offsets],
  );

  return { offsets, offsetOf, handlersFor, draggingId };
}
