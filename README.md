# Meddi API

- CRUD de tareas
- Filtrado por prioridad
- Filtrado por fecha de creación
- Ordenamiento por fecha de creación
- Búsqueda por título
- Agrupación de tareas por prioridad
- Estadísticas de tareas por prioridad y estado
- Ranking de días con más tareas creadas
- Ranking de días con más tareas completadas

## Tecnologias utilizadas para realizar la api
- NestJS
- MongoDB Atlas
- Mongoose
- TypeScript
- Swagger
- Docker
- pnpm

## Instalacion del proyecto
El proyecto puede correrse de dos maneras:
La mas sencilla es con docker utilizando:
docker compose up --build

API va a levantarse en http://localhost:8000

La segunda manera es en local:
Install dependencies:

pnpm install

y despues 

pnpm run start:dev

## Documentacion
La documentacion del proyecto esta hecha con Swagger, esta disponible en:
http://localhost:8000/docs

## Endpoints
Los endpoints implementados son los siguientes:
GET | /tasks | Obtener todas las tasks
GET | /tasks/:id | Obtener tasks por id
POST | /tasks | Crear task
PUT | /tasks/:id | Actualizar tasks, status y priority
DELETE | /tasks/:id | borrar task por id
GET | /tasks/grouped-by-priority | Obtener task agrupados por prioridad
GET | /tasks/stats | Obtener estadisticas de tasks

## Estructura del proyecto
src/
├── tasks/
│   ├── schemas/
│   ├── types/
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
├── app.module.ts
└── main.ts

## Desiciones tecnicas
- Implemente indices en las propiedades de `priority` y `status` porque son usados frecuentemente en filtros.
- Las estadisticas estan implementadas desde el backend para facilitar la implementacion en el frontend
- Añadi Swagger para tener mas facilidad de testear y para documentacion
- Agregue docker para facilitar la ejecucion del proyecto y asegurar que funcione en cualquier entorno

