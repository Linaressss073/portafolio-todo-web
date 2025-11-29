# todo-web (Angular)

Frontend Angular + Material para la API de tareas.

## Requisitos
- Node 18+ (npm 10)

## Variables de entorno
- `API_BASE_URL` (prod): URL pública del backend (ej: `https://<tu-app>.onrender.com`).

Archivos:
- `src/environments/environment.ts` (dev, default `http://localhost:8080`)
- `src/environments/environment.prod.ts` (ajusta para Render antes de build)

## Instalar y correr en dev
```bash
cd todo-web
npm install
npm start   # http://localhost:4200
```

## Build prod (Render static o Vercel)
```bash
npm run build
# dist/todo-web
```
En Render (static site):
- Build command: `npm install && npm run build`
- Publish dir: `dist/todo-web/browser`
- Env `API_BASE_URL` apuntando al backend en Render (ej: `https://task-service.onrender.com`)

En Vercel configura la env `API_BASE_URL` y ejecuta `npm run build`.

## Funcionalidad
- Tabla con paginación/sort remoto, filtro por status.
- Crear/editar (form reactivo con validaciones y datepicker).
- Borrar con confirmación.
- Toasters para errores (interceptor HTTP).
