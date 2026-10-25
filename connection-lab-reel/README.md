# Connection Lab — Reel vertical (HyperFrames)

Vídeo tutorial **1080×1920, 15 s**, con locución en español y subtítulos sincronizados
palabra por palabra. Compuesto con el contrato real de HyperFrames (escenas en
`compositions/`, timeline registrada en `window.__timelines`).

## Herencia visual (extraída del `index.html` real)

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

`Space Grotesk` y `VT323` **no** vienen en el bundle de HyperFrames, así que se sirven
por `@font-face` desde `assets/fonts/` (lint exige `font_family_without_font_face`).
`JetBrains Mono` sí está empaquetada y resuelve por nombre.

> Los tonos `#0f172a` y `#10b981` **no existen** en el proyecto (son de Tailwind).
> Se usa la paleta real para que el vídeo parezca grabado desde la app.

## Estructura

```
index.html                        raíz: 1080×1920, 15 s, monta escenas + audio
compositions/scene-title.html     0–4 s    título elástico
compositions/scene-dashboard.html 4–10 s   dashboard animado
compositions/scene-cta.html       10–15 s  cierre + CTA
compositions/scene-captions.html  0–15 s   pista única de subtítulos
assets/line{1,2,3}.wav            locución (Kokoro, voz ef_dora)
assets/line{1,2,3}.words.json     timings de palabra de la transcripción
assets/fonts/                     Space Grotesk + VT323 (woff2)
```

Cada escena lleva su propia timeline (`fromTo`, nunca `from`: el host re-seeka la
escena y `from` deriva). Ninguna usa `repeat:-1` ni bucles `requestAnimationFrame`,
porque el renderer recorre la timeline fotograma a fotograma.

## Locución: TTS local (Kokoro)

Sin cuenta, sin créditos. Requisitos: `espeak-ng` en el PATH (fonemización en
español) y FFmpeg.

```powershell
# espeak-ng debe estar accesible para Kokoro en español
$env:PATH += ";C:\Program Files\eSpeak NG"

# Una frase por fichero .txt; se pasa la RUTA plana (sin "@" ni "--file")
npx hyperframes tts assets/line1.txt --voice ef_dora --lang es --speed 1.12 -o assets/line1.wav
```

> **Trampa**: `@assets/line1.txt` no funciona — el CLI lee la cadena literal y
> sintetiza el texto `@assets/line1.txt`. Pasa la ruta tal cual.

Duraciones generadas: **3.39 / 4.86 / 2.75 s** = 11 s de voz en ventanas de 4/6/5 s.

## Subtítulos sincronizados

```powershell
npx hyperframes transcribe assets/line1.wav      # escribe assets/transcript.json
```

Parakeet (instalado con `npx hyperframes models install parakeet`) es un modelo
**solo inglés**: el texto que devuelve del español sale distorsionado
(`Pruébalo` → `PruǸvalo`). Los **bordes acústicos son reales**, así que se usan
esos `start`/`end` y se mapean mis palabras españolas **por posición** (regla de
`captions.md`: *"match transcript words to caption words by position, not text"*).

Los grupos viven en `GROUPS` dentro de `compositions/scene-captions.html`, en el
reloj global de 15 s. Cada grupo hace `set` de visibilidad y `to` de opacidad por
palabra — todo determinista ante seeks en ambas direcciones.

## Comandos

```powershell
npm run check     # lint + layout + motion (0 errores, 0 avisos)
npm run preview   # servidor de previsualización
npm run render    # MP4 1080×1920 con ffmpeg
```

FFmpeg se instaló con `winget install Gyan.FFmpeg`; si el shell no lo ve aún,
añade `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\ffmpeg-9.0.2-full_build\bin`
al PATH.

## Zona segura vertical

En 1080×1920 la app dibuja encima: nada en los 168 px superiores, el contenido en
la banda 168–1330 px, y por debajo de 1330 solo textura. Los subtítulos van a
640 px del borde inferior, dentro de esa banda.
