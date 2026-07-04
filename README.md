# Dashboard de ruteo · Validación de identidad por WhatsApp

## ¿Qué es esto?

Es un dashboard de demostración para mostrarle a prospectos y clientes **qué pasa por dentro cuando una persona valida su identidad por WhatsApp con Truora**.

Hoy ese proceso es invisible: el usuario final solo ve una conversación de WhatsApp, y el cliente solo ve el resultado ("aprobado" o "rechazado"). Este dashboard hace visible todo lo que ocurre en el medio: por qué ruta pasó la validación, qué productos de Truora se ejecutaron, qué porcentaje del tráfico va por cada camino, contra qué fuentes oficiales se verificó y en qué países opera el flujo.

La idea es usarlo en demos comerciales: se abre en el navegador, se recorre de arriba a abajo y el prospecto entiende el producto completo en un par de minutos, sin diapositivas.

**Importante:** por ahora todos los números son datos de demostración (están inventados, pero son realistas). El proyecto está preparado para que ingeniería conecte los datos reales más adelante; abajo se explica exactamente dónde.

## ¿Qué se ve en la pantalla?

Todo el dashboard vive dentro de una "ventana de navegador" simulada (como los screenshots de producto de Yuno o Stripe), con el logo de Truora y una barra lateral de navegación funcional a la izquierda: **Resumen, Rutas, Playground, En vivo, Conexiones, Riesgo, Reportes y Configuración** son páginas reales. La barra se puede colapsar a un rail de íconos, en móvil hay menú hamburguesa, y todas las páginas cierran con el mismo llamado a la acción: "Impleméntalo con tu producto → Agendar una asesoría".

La página de Resumen abre con **una secuencia real del producto en movimiento** (frames extraídos del video del Motor de Cobro que se reproducen en loop, con los pasos del proceso encendiéndose en sincronía: cobro programado → reintento inteligente → pago exitoso) y luego tiene seis secciones:

### 1. Resumen del flujo
Cuatro indicadores grandes, cada uno con su mini gráfica de tendencia al lado. **Son seleccionables**: al hacer clic en cualquiera, la gráfica principal cambia a su serie de seis meses (con dominio y unidad propios, incluso segundos para el tiempo de validación):

- **Conversión total del flujo** (la celda índigo, el número héroe): de cada 100 personas que empiezan la validación en WhatsApp, cuántas la terminan con éxito.
- **Aprobación documento + facial**: qué tan bien funciona la validación principal.
- **Éxito en reintentos**: cuántas validaciones que fallaron a la primera se recuperan al reintentar.
- **Tiempo mediano de validación**: cuánto tarda una persona típica en completar todo.

La gráfica de al lado muestra la conversión mes a mes (enero a junio). Al pasar el mouse por encima aparece el valor exacto de cada mes.

### 2. Recorrido de la validación (la sección estrella)
Un diagrama de flujo estilo "canvas de ruteo" que cuenta la historia completa de una validación:

1. **WhatsApp**: la persona escribe al número del cliente y se abre el flujo (con su ID, canal y nombre del flujo, como se vería en producción).
2. **Condición de país y documento**: el sistema decide la ruta según el país del teléfono (CL, MX, CO, PE) y el tipo de documento (cédula, DNI, INE).
3. **Ruteo inteligente**: el motor elige la mejor ruta para maximizar conversión. Las insignias sobre las líneas muestran el reparto del tráfico: el 72% va por **documento + facial** (la ruta principal) y el 28% por **solo documento** (la ruta de respaldo).
4. **Señales en paralelo**: mientras tanto, sin fricción para el usuario, se validan el teléfono (OTP por WhatsApp), el correo y la geolocalización. Van con línea punteada porque corren al mismo tiempo que el resto.
5. **Antecedentes**: se consulta a la persona contra listas AML, PEP y registros locales.
6. **Firma electrónica**: la persona acepta términos y firma el contrato en el mismo chat.
7. **Decisión final**: aprobado (91.3%), revisión manual (6.2%) o rechazado (2.5%).

Cada tarjeta muestra sus tasas de éxito/rechazo/error, igual que lo haría el producto real. Las líneas tienen un trazo animado que indica la dirección del flujo.

### 3. Truora en el centro del ruteo
Un diagrama de arquitectura (estilo integración de pagos): a la izquierda entran tus canales (WhatsApp, Web, App, API) y tu sistema; en el centro está **Truora como el hub del ruteo** (ruteo inteligente, validación de identidad, motor de riesgo); a la derecha, las fuentes oficiales por país, las listas de riesgo y el webhook que devuelve la decisión a tu sistema. Las líneas fluyen animadas con flechas de dirección.

### 4. Bloques de validación
Los **7 productos de Truora** que componen el flujo, cada uno como una tarjeta con su interruptor de encendido/apagado (los toggles funcionan, para jugar con ellos en el demo):

- Validación de documento y facial
- Validación de documento
- Validación de teléfono
- Validación de correo
- Validación de antecedentes
- Validación de firma electrónica
- Geolocalización (apagada por defecto, para mostrar que se puede activar en vivo)

El mensaje comercial de esta sección: el flujo se arma y se modifica **sin escribir código**.

### 5. Cobertura
Un mapa de Latinoamérica hecho con matriz de puntos (el estilo de mapa de Yuno), con **Chile resaltado en índigo y un marcador pulsante en Santiago**, porque el demo está ambientado en un onboarding chileno. Al lado, el panel de cobertura: 18 países, 60+ fuentes oficiales, 2.4M de validaciones al mes, y el ranking de principales mercados (Chile, México, Colombia, Perú, Brasil, Argentina) con su volumen.

### 6. Fuentes de verificación
Una tabla que responde la pregunta que siempre hacen los equipos de riesgo: *"¿contra qué validan?"*. Registro Civil (Chile), RENIEC (Perú), Registraduría (Colombia), INE (México), listas AML/PEP/sanciones y operadores móviles, con la cobertura y capacidades de cada fuente (biometría, OCR, vigencia, monitoreo continuo). Tiene un buscador arriba a la derecha.

## El playground (la página para ver el producto en acción)

En **/playground** se simula una validación completa en vivo, pensado para el momento "muéstramelo funcionando" del demo:

- Eliges el **país** (CL, MX, CO, PE): cambia el documento, la fuente oficial y hasta el prefijo del teléfono del chat.
- Eliges el **resultado** (aleatorio, aprobado, revisión manual o rechazado) para contar la historia que necesites.
- Al presionar **Iniciar simulación** pasan tres cosas a la vez:
  1. El **canvas de ruteo** se anima: cada nodo se enciende cuando le toca, las conexiones recorridas se pintan de índigo y el resto se atenúa.
  2. Un **chat de WhatsApp simulado** muestra la conversación tal como la vive el usuario final (saludo, foto del documento, selfie, firma, resultado).
  3. Un **log de eventos** registra cada paso con su timestamp: condición evaluada, ruta elegida por el ruteo inteligente, fuente consultada, señales en paralelo y decisión final notificada por webhook.

Al terminar aparece la tarjeta de resultado (aprobado / revisión / rechazado) con la duración total. Se puede reiniciar y correr tantas veces como se quiera.

## Las demás páginas

- **Rutas**: seis rutas con su caso de uso (apertura de cuenta, colocación de producto, contratación remota, recuperación de acceso, cumplimiento AML), estado, conversión y acceso directo al playground.
- **En vivo** (Próximamente): la futura herramienta para conectar tu proceso real. Muestra en loop la animación del ruteo: la validación entra, el motor consulta el registro de identidad, las listas de riesgo y el operador móvil, sale el sello de "Aprobado" y el proceso continúa a la firma.
- **Conexiones**: los conectores por país (Registro Civil, RENIEC, INE, listas AML, WhatsApp Business API…) con buscador y botón "Conectar" funcional.
- **Riesgo**: reglas tipo "Bloquear si / Permitir si / Revisar si" con sus condiciones y toggles para activarlas.
- **Reportes**: los KPIs con sus tendencias, la gráfica mensual y la tabla de últimas validaciones con resultado y duración.
- **Configuración**: la configuración por país (Registro Civil → CL, Registraduría → CO, RENIEC → PE, INE → MX, y SERPRO/RENAPER disponibles) más el formulario del flujo con guardado simulado.

## Cómo correrlo

Se necesita Node.js 20 o superior.

```bash
npm install
npm run dev
# abrir http://localhost:3000
```

Para un build de producción: `npm run build && npm run start`.

No hay variables de entorno ni servicios externos: clonar, instalar y correr.

## Cómo está construido

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**.
- Componentes de **shadcn/ui** y **cult-ui**: los botones con textura (`TextureButton`, el CTA "Publicar ruta" usa la variante `accent` índigo), las tarjetas con textura (`TextureCard`, todas blancas con texto negro), la ventana de navegador simulada (`BrowserWindow`) y el fondo con grano (`TextureOverlay` tipo `noise` a opacidad baja).
- La gráfica y el mapa son **SVG hechos a mano** (sin librerías de charts), para mantener el proyecto liviano y el estilo exacto.
- El canvas de ruteo dibuja las conexiones midiendo la posición real de las tarjetas y **se escala solo** para que el proceso completo se vea sin scroll horizontal.
- Tema claro fijo (es un asset de demo, se ve igual en cualquier máquina) y las animaciones respetan `prefers-reduced-motion`.

```
src/
  app/                    # Layout, la página y los tokens de diseño (globals.css)
  components/
    dashboard/            # Una pieza por sección: kpi-band, conversion-chart,
                          # routing-canvas, product-blocks, latam-map,
                          # coverage-panel, sources-table, flow-toolbar, shell
    ui/                   # shadcn + cult-ui (texture-button, texture-card, ...)
  data/                   # ← LA CAPA DE DATOS. Todo lo que se ve sale de aquí.
```

## Para ingeniería: cómo conectar los datos reales

Este es el punto más importante del repo. **Ningún componente tiene datos quemados**: todo lo que se muestra en pantalla sale de los archivos de `src/data/`, que exportan tipos de TypeScript + constantes mock. Cada archivo tiene un comentario `TODO(data)` con el endpoint sugerido.

Para conectar una fuente real solo hay que reemplazar la constante por un fetch que devuelva **la misma forma**; los componentes no se tocan.

| Archivo | Qué alimenta | Endpoint sugerido |
| --- | --- | --- |
| `data/kpis.ts` | Los 4 indicadores del resumen | `GET /v1/metrics/identity-routing?channel=whatsapp&range=30d` |
| `data/conversion.ts` | La gráfica de conversión mensual | `GET /v1/metrics/identity-routing/timeseries` |
| `data/flow.ts` | El canvas del recorrido: nodos, conexiones, % por ruta y posiciones | `GET /v1/routing/flows/:id` |
| `data/products.ts` | Los toggles de bloques de validación | `GET /v1/flows/:id/steps` |
| `data/coverage.ts` | El panel de cobertura por país | `GET /v1/metrics/identity-routing/by-country` |
| `data/sources.ts` | La tabla de fuentes de verificación | `GET /v1/sources?region=latam` |
| `data/country-stack.ts` | Configuración por país (playground y Configuración) | `GET /v1/config/countries` |
| `data/simulation.ts` | Países, documentos y fuentes del playground | `GET /v1/flows/:id/simulate` (sandbox) |
| `data/routes-list.ts` | La página Rutas | `GET /v1/routing/flows` |
| `data/connections.ts` | La página Conexiones | `GET /v1/sources` + estado de la cuenta |
| `data/risk-rules.ts` | La página Riesgo | `GET /v1/risk/rules` |
| `data/recent-validations.ts` | Tabla de últimas validaciones (Reportes) | `GET /v1/validations?limit=10` |

Sugerencia de implementación: convertir las secciones que lo necesiten a `async` Server Components y hacer el fetch del lado del servidor, o exponer route handlers en `src/app/api/*` que lean de los servicios internos. Mientras el API no exista, el demo funciona 100% estático.

Detalle útil para el demo en vivo: los toggles de productos y el modo de prueba son estado local de React. Si se conectan a un API real, el vendedor podría encender un bloque durante la llamada y que el cambio sea de verdad.

## Cómo adaptarlo a otro país u otro cliente

- **Cambiar el país foco**: en `data/coverage.ts` mover el flag `focus`, y en `data/map-data.ts` ajustar los marcadores (cada marcador tiene coordenadas de celda y un `side` para que la etiqueta no se encime con otra).
- **Cambiar el nombre del flujo**: está en `components/dashboard/flow-toolbar.tsx` (el título "WhatsApp Onboarding · LATAM") y en el nodo de inicio de `data/flow.ts`.
- **Cambiar rutas o porcentajes del canvas**: todo en `data/flow.ts`; las posiciones son coordenadas absolutas dentro del lienzo y las conexiones se declaran como pares `from → to`.

## Cambios que quedan por hacer

Ordenados por valor. Ninguno bloquea el demo actual; todo lo listado arriba funciona hoy.

**Producto / demo**
- [ ] **Deep links del playground** (`/playground?pais=CO&resultado=rechazado`): preparar el demo antes de la llamada y abrirlo ya configurado.
- [ ] **Playground por ruta**: hoy las rutas activas abren el mismo playground genérico; pasar el caso de uso (colocación de crédito vs. onboarding) y ajustar el guion del chat.
- [ ] **Modo presentación**: botón que oculte el marco del navegador simulado y ponga el contenido a pantalla completa para proyectar.
- [ ] **Feed de actividad en vivo en el Resumen**: validaciones mock entrando cada pocos segundos para sensación de producto vivo.
- [ ] **Typing indicator real en el chat** (tres puntos animados antes de cada mensaje del bot).
- [ ] **Export del resultado de la simulación** (copiar resumen / one-pager imprimible para dejarle al prospecto).
- [ ] **Control de velocidad de la simulación** (1x / 2x / saltar al final).
- [ ] **Versión PT-BR** cuando se active Brasil.
- [ ] **Video del flujo de identidad por WhatsApp**: cuando exista, repetir la extracción de frames (ver abajo) y reemplazar la secuencia del Motor de Cobro en la apertura.

**Ingeniería**
- [ ] **Conectar los data sources reales** (tabla de arriba): es el pendiente principal; la capa `src/data/` ya está tipada y aislada para eso.
- [ ] **Página "En vivo"**: hoy es una animación con "Próximamente"; el plan es un websocket/polling que dibuje las validaciones reales en el canvas.
- [ ] **Tests**: no hay ninguno. Mínimo un smoke e2e con Playwright (cargar cada página + correr una simulación completa).
- [ ] **Tokens de theming**: los componentes usan clases `indigo-*`/`neutral-*` directas; mover el acento y los hex de los SVG (#4F46E5) a los tokens de `globals.css` para poder cambiar la marca en un solo lugar.
- [x] **CTA "Agendar una asesoría"**: apunta a https://www.truora.com/es/contacto-ventas (visible al pie y como botón flotante en todas las páginas).
- [ ] **Analytics**: instrumentar los clics clave (Iniciar simulación, Agendar asesoría, Conectar) para medir los demos.

**Cómo se extrajeron los frames del video** (para repetirlo con otro video):

```bash
ffmpeg -y -i "video.mp4" -vf "fps=4,scale=564:-2" -q:v 4 /tmp/frame-%02d.jpg
# el ffmpeg de Homebrew no trae libwebp; convertir con Pillow:
python3 -c "from PIL import Image; import glob; [Image.open(f).convert('RGB').save(f'public/proceso/frame-{i:02d}.webp','WEBP',quality=82) for i,f in enumerate(sorted(glob.glob('/tmp/frame-*.jpg')),1)]"
```

## Deploy

Es un sitio estático sin secretos. En Vercel: importar el repo, preset Next.js, deploy. Cualquier URL resultante sirve para compartir el demo con clientes.
