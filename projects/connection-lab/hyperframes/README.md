# Connection Lab — Reel vertical (HyperFrames)

Vídeo tutorial **1080×1920, 15 s**, generado a partir del `index.html` real de
`projects/connection-lab/`.

## Herencia visual (extraída del archivo real)

La paleta y tipografías se copian **literalmente** de `projects/connection-lab/index.html`.

| Token | Valor |
|---|---|
| `--bg` | `#090c12` |
| `--panel` / `--panel-2` | `#111722` / `#151d29` |
| `--line` | `#253040` |
| `--text` / `--muted` | `#eef4fb` / `#8492a6` |
| `--cyan` | `#26c5dd` |
| `--blue` | `#4b8dff` |
| `--green` | `#46dfad` |
| `--violet` | `#a88bff` |
| `--yellow` / `--red` | `#f5c451` / `#ff7885` |

- **Fondo**: `radial-gradient(ellipse at 50% -25%, #152a3a 0, transparent 52%), #090c12`
- **Tipografías**: `Space Grotesk` (sans) · `JetBrains Mono` (mono) · `VT323` (emblema de tier)

> Nota: los tonos `#0f172a` y `#10b981` que se sugirieron **no existen** en el proyecto
> (son de Tailwind). Se usa la paleta real para que el vídeo parezca grabado desde la app.

## Escenas

| Tiempo | Escena | Animación |
|---|---|---|
| 0–4 s | Título "Connection Lab" | `elastic.out(1, 0.6)` sobre el `h1`, más eyebrow con live-dot |
| 4–10 s | Dashboard animado | Arco de gauge hasta 89/100, emblema de tier "S" (VT323), contadores 1.90 / 1.12 Gbps, gráfica SVG por `stroke-dashoffset`, 4 chips de actividad con barras |
| 10–15 s | Cierre + CTA | Logo, botón "Probar ahora" con pulso infinito y anillo expansivo |

Los datos de la escena 2 salen de un test real: **89/100 · tier S · 1.90 Gbps ↓ / 1.12 Gbps ↑**.

## Locución (TTS)

El `index.html` carga `<audio src="locucion.mp3">`. **No incluye el mp3** porque este
entorno no tiene shell ni motor TTS. Generarlo con cualquiera de estas opciones:

```bash
# edge-tts (recomendado, voz neural de Microsoft, gratis)
edge-tts --voice es-ES-ElviraNeural \
  --text "Descubre Connection Lab, la forma honesta de medir tu internet. Velocidad real, latencia, jitter y un tier de D a SS, más puntuación por actividad. Pruébalo ahora en rodrigosendinosanz github io. ¡Y comparte tu resultado!" \
  --write-media projects/connection-lab/hyperframes/locucion.mp3

# macOS (voz del sistema)
say -v Mónica -o projects/connection-lab/hyperframes/locucion.aiff
afconvert projects/connection-lab/hyperframes/locucion.aiff projects/connection-lab/hyperframes/locucion.mp3

# Piper (offline, local)
echo "Descubre Connection Lab..." | piper --model es_ES-davefx-medium --output_file projects/connection-lab/hyperframes/locucion.mp3
```

Colocar el archivo como `locucion.mp3` junto al `index.html`.

**Sin audio funciona igual**: la página cae a un reloj interno de 15 s y muestra un aviso
amarillo en la parte superior, así que puedes previsualizar antes de generar la voz.

### Sincronización de subtítulos

El guion está partido en `CUES` con `start`/`end` por palabra sobre una línea de 15 s
(ver `SCRIPT` en el `<script>`). Si ajustas el audio, mueve esos marcos de tiempo. Los
subtítulos se pintan con `audio.currentTime`, así que quedan palabra por palabra.

## Previsualizar

```bash
npx serve projects/connection-lab/hyperframes
# o
python -m http.server 8080 --directory projects/connection-lab/hyperframes
```

Abrir la URL y **hacer clic o pulsar barra espaciadora** para arrancar: los navegadores
bloquean el autoplay de audio sin un gesto previo del usuario.

## Grabar el vídeo

Con el lienzo a 1080×1920 (pantalla completa o viewport fijo), usar el grabador de
pantalla del sistema, o bien **OBS Studio** con una fuente "Navegador" apuntando a la
URL, configurada a 1080×1920 @ 60 fps. Para exportar a MP4 directamente desde el
navegador se puede usar `chrome://extensions` + `Loom`, o `Puppeteer`/`Playwright`
con `page.screenshot()` en bucle y `ffmpeg` para ensamblar.
