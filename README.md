# Dashboard · Ruteo de validación de identidad por WhatsApp

Dashboard de demostración comercial que muestra, con estética tipo Yuno, cómo Truora rutea una validación de identidad iniciada por WhatsApp: bloques de validación, recorrido de la decisión, cobertura LATAM (con Chile como foco del demo) y fuentes de verificación por país.

## Correr en local

```bash
npm install
npm run dev
# http://localhost:3000
```

Build de producción: `npm run build && npm run start`.

## Estructura

```
src/
  app/                    # Layout, página única y tokens de diseño (globals.css)
  components/
    dashboard/            # Secciones del dashboard (ver tabla de datos abajo)
    ui/                   # shadcn + cult-ui (texture-button, texture-card,
                          # texture-overlay, mock-browser-window, switch, ...)
  data/                   # ← CAPA DE DATOS MOCK. Todo lo que se ve sale de aquí.
```

## Conectar los data sources (para ingeniería)

Todo el contenido es mock y vive en `src/data/`. Cada archivo exporta tipos + constantes y tiene un comentario `TODO(data)` con el endpoint sugerido. Para conectar datos reales basta con reemplazar la constante por un fetch que devuelva la misma forma; los componentes no necesitan cambios.

| Archivo | Alimenta | Endpoint sugerido |
| --- | --- | --- |
| `data/kpis.ts` | Banda de KPIs | `GET /v1/metrics/identity-routing?channel=whatsapp&range=30d` |
| `data/conversion.ts` | Gráfica de conversión mensual | `GET /v1/metrics/identity-routing/timeseries` |
| `data/flow.ts` | Canvas del recorrido (nodos, conexiones, % por ruta) | `GET /v1/routing/flows/:id` |
| `data/products.ts` | Toggles de bloques de validación | `GET /v1/flows/:id/steps` |
| `data/coverage.ts` | Panel de cobertura por país | `GET /v1/metrics/identity-routing/by-country` |
| `data/sources.ts` | Tabla de fuentes de verificación | `GET /v1/sources?region=latam` |
| `data/map-data.ts` | Mapa de puntos LATAM (silueta estilizada y marcadores) | estático; solo cambiar marcadores |

Sugerencia de implementación: convertir las secciones que lo necesiten a `async` Server Components y hacer el fetch en servidor, o exponer route handlers en `src/app/api/*` que lean de los servicios internos. Mientras el API no exista, el demo funciona 100% estático (ideal para Vercel).

## Decisiones de diseño

- **Estilo Yuno**: lienzo gris frío con grano (`TextureOverlay` tipo `noise`), retícula de puntos en el canvas de ruteo, índigo como único acento, tarjetas blancas con texto negro.
- **Componentes cult-ui**: `TextureButton` (variante `accent` para el CTA primario), `TextureCardStyled` para todas las tarjetas y `BrowserWindow` (Chrome, sidebar izquierda) como marco del dashboard.
- **Canvas de ruteo**: los nodos se posicionan desde `data/flow.ts`; las conexiones se dibujan en SVG midiendo los nodos reales y el lienzo se escala para mostrar el proceso completo sin scroll (con mínimo de legibilidad de 0.55).
- **Tema fijo claro** y `prefers-reduced-motion` respetado en las animaciones (trazo de rutas y pulso de Santiago).

## Deploy

Proyecto estático, sin variables de entorno. En Vercel: importar el repo y deploy directo (framework preset: Next.js).
