# Firme · prototipo web

> ¿Cómo lograr que un joven que busca su primer trabajo lo consiga formal, o empiece a generar su propio ingreso, en menos de tres meses?

Prototipo navegable del equipo **Delions** (Hackathon Cantera 2026, Casa Fragua). Muestra en menos de 2 minutos cómo un joven pasa de "busco trabajo" a "tengo una solicitud formal en seguimiento". Se construyó según `../PRD_prototipo.md`.

- El **chatbot de CV usa IA real** (Gemini). Si la IA falla o tarda más de 8 segundos, sigue con preguntas guionadas y la demo no se corta.
- Las vacantes, la aplicación automática y el seguimiento usan **datos de ejemplo**, y la página lo indica.
- La persona de la demo ("Dani") es ficticia. No hay datos de personas entrevistadas.

## Pantallas

| # | Pantalla | Mascota (clip 3D) |
|---|---|---|
| 1 | Inicio | Saludo |
| 2 | Registro (horario, puestos, empresas, CV) | — |
| 3 | Chatbot de CV con IA | Saludo → Busca → Tecleando → GuardaCV |
| 4 | Lista corta con filtro "Solo con contrato" | Busca |
| 5 | Vacante y CV adaptado | — |
| 6 | Aplicación automática simulada y "Aprobar y enviar" | GuardaCV → Avion |
| 7 | Seguimiento con recordatorio a los 14 días | Reposo |
| 8 | Guía de papeleo (CURP, RFC, NSS) | — |
| 9 | Métricas: línea base real y datos simulados marcados | — |

La barra de puntos de arriba permite saltar a cualquier pantalla durante el pitch, y "Reiniciar demo" vuelve todo al inicio.

## Correr en local

Requiere Node 18 o más reciente.

```bash
npm install
```

```bash
cp .env.example .env.local
```

Escribe tu clave en `.env.local` (`GEMINI_API_KEY=...`). Ese archivo no se sube al repositorio.

```bash
npm run dev
```

Abre http://localhost:5173. En desarrollo, `/api/chat` corre la misma función que usa Vercel.

## Publicar en Vercel (gratis)

1. Sube esta carpeta a un repositorio de GitHub.
2. En vercel.com, "Add New → Project" e importa el repositorio. Vercel detecta Vite solo.
3. En "Environment Variables" agrega `GEMINI_API_KEY` (y, si quieres, `GEMINI_MODEL`).
4. "Deploy". La función `api/chat.js` queda en `/api/chat`.

La clave vive solo en la función del servidor: nunca está en el código del navegador ni en el repositorio.

Para Netlify habría que mover `api/chat.js` a `netlify/functions/` con el formato de Netlify. Por eso se recomienda Vercel.

## Estructura

```
api/chat.js          Función del servidor: llama a Gemini con un modelo principal y dos de reserva
src/App.jsx          Navegación entre las 9 pantallas y estado de la demo
src/Chat.jsx         Chatbot de CV (IA real y respaldo guionado a los 8 s)
src/screens.jsx      Las demás pantallas
src/firme.jsx        Componentes del Design System Firme (Button, ContractSeal, ScheduleChip, VacancyCard, StatusTracker)
src/Mascota.jsx      Mascota 3D (model-viewer) con pose fija de respaldo
src/data.js          Persona, vacantes, solicitudes y métricas de ejemplo
src/tokens.css       Tokens de color, tipografía y espaciado (claro y oscuro)
public/mascota/      firme_mascota.glb y las 7 poses en WebP
public/marca/        Logos y sellos en SVG
```

## Modelo de IA

Por defecto usa `gemini-3.1-flash-lite`, que en pruebas respondió en 1 a 2 segundos. Si está saturado, la función intenta `gemini-3.5-flash-lite` y luego `gemini-flash-lite-latest`, todo dentro del límite de 7.5 segundos. Puedes cambiar el principal con `GEMINI_MODEL`.
