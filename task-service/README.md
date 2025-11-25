# task-service (Spring Boot)

API de tareas con Spring Boot, Postgres y Flyway.

## Requisitos
- Java 17 (`export JAVA_HOME=$(/usr/libexec/java_home -v 17)`)
- Maven Wrapper (`./mvnw`)
- Docker (para Postgres local)

## Variables de entorno
- `PORT` (opcional, default 8080)
- `SPRING_DATASOURCE_URL` (ej: `jdbc:postgresql://localhost:7070/app_db`)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `CORS_ALLOWED_ORIGIN` (ej: `https://<tu-app>.vercel.app`)

## Ejecutar en local
```bash
cd task-service
./mvnw spring-boot:run
```
Swagger: `http://localhost:8080/swagger-ui.html`  
Health: `http://localhost:8080/actuator/health`

## Base de datos local con Docker
```bash
cd task-service
docker compose up -d
# luego usa SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:7070/app_db
```

## Tests
Perfil `test` usa H2 en memoria (sin Flyway).
```bash
./mvnw test
```

## Endpoints clave
- `POST /tasks` crea tarea (title 1..120, dueDate futuro opcional).
- `GET /tasks?status=&page=&size=&sort=createdAt,desc` lista paginada.
- `GET /tasks/{id}` detalle.
- `PATCH /tasks/{id}` actualiza parcial title/status/dueDate.
- `DELETE /tasks/{id}` borra.
Errores: `{timestamp, path, code, message, details[]}`.

## Despliegue (Render)
- Build: `./mvnw -DskipTests package`
- Env: `PORT`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `CORS_ALLOWED_ORIGIN` (dominio Vercel).
- Healthcheck: `/actuator/health`

hola 