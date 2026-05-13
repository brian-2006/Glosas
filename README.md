# Glosas

Sistema desarrollado con Docker Compose para levantar automáticamente:

- Backend
- Frontend
- Base de datos PostgreSQL

---

# Requisitos

Antes de iniciar el proyecto debes tener instalado:

- Docker Desktop
- Git

---

# Verificar instalaciones

```bash
docker --version
docker compose version
git --version
```

---

# Clonar el repositorio

```bash
git clone https://github.com/brian-2006/Glosas.git
```

Entrar a la carpeta del proyecto:

```bash
cd Glosas
```

---

# Configurar variables de entorno

El proyecto utiliza un archivo `.env` para manejar las variables de entorno.

Por seguridad, el `.env` real no se incluye en el repositorio.

Debes crear uno a partir del archivo `.env.example`.

---

## Linux / Mac / Git Bash

```bash
cp .env.example .env
```

---

## Windows CMD

```cmd
copy .env.example .env
```

---

# Configurar `.env`

Abrir el archivo `.env` y configurar las variables necesarias.

Ejemplo:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=glosas_db
DB_PORT=5432
DB_HOST=db

SECRET_KEY=tu_secret_key

VITE_API_URL=http://localhost:8000
```

---

# Iniciar Docker

Asegurarse de que Docker Desktop esté ejecutándose.

Verificar:

```bash
docker ps
```

---

# Levantar el proyecto

Construir y ejecutar todos los contenedores:

```bash
docker compose up --build
```

---

# Ejecutar en segundo plano

```bash
docker compose up -d --build
```

---

# Acceder al proyecto

## Frontend

```txt
http://localhost:5173
```

---

## Backend

```txt
http://localhost:8000
```

---

# Ver logs

```bash
docker compose logs
```

Logs en tiempo real:

```bash
docker compose logs -f
```

---

# Ver contenedores activos

```bash
docker ps
```

---

# Detener contenedores

```bash
docker compose down
```

---

# Eliminar contenedores y volúmenes

```bash
docker compose down -v
```

---

# Reconstruir contenedores

Si se modifican:

- Dockerfiles
- dependencias
- variables
- configuración

Ejecutar nuevamente:

```bash
docker compose up --build
```

---

# Tecnologías utilizadas

- Docker
- Docker Compose
- FastAPI
- PostgreSQL
- React

---

# Autor

Desarrollado por Brian.
