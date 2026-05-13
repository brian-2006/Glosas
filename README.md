# Glosas

Sistema desarrollado utilizando Docker Compose para facilitar el despliegue y ejecución del proyecto completo.

El proyecto contiene:

- Backend
- Frontend
- Base de datos

---

# Requisitos

Antes de iniciar el proyecto debes tener instalado:

## 1. Docker Desktop

Descargar e instalar:

[Docker Desktop](https://www.docker.com/products/docker-desktop/?utm_source=chatgpt.com)

Verificar instalación:

```bash
docker --version
docker compose version
```

---

## 2. Git

Descargar:

[Git](https://git-scm.com/downloads?utm_source=chatgpt.com)

Verificar instalación:

```bash
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

# Inicializar el proyecto

## 1. Abrir Docker Desktop

Asegúrate de que Docker Desktop esté ejecutándose antes de continuar.

Puedes verificarlo con:

```bash
docker ps
```

Si no aparece ningún error, Docker está funcionando correctamente.

---

## 2. Construir y levantar contenedores

Ejecutar:

```bash
docker compose up --build
```

Este comando:

- Construye las imágenes Docker
- Crea los contenedores
- Levanta el backend
- Levanta el frontend
- Levanta la base de datos

---

# Levantar contenedores en segundo plano

Si deseas dejar el proyecto ejecutándose en background:

```bash
docker compose up -d --build
```

---

# Verificar contenedores activos

```bash
docker ps
```

---

# Ver logs del proyecto

Logs generales:

```bash
docker compose logs
```

Logs en tiempo real:

```bash
docker compose logs -f
```

---

# Acceso al proyecto

## Backend

```txt
http://localhost:8000
```

---

## Frontend

```txt
 http://localhost:5173
```

---

# Detener el proyecto

```bash
docker compose down
```

---

# Reconstruir contenedores

Si se modifican:

- Dockerfiles
- requirements.txt
- dependencias
- configuración del contenedor

Ejecutar nuevamente:

```bash
docker compose up --build
```



---

# Solución de errores comunes

## Docker no está iniciado

Error típico:

```txt
error during connect
```

Solución:

- Abrir Docker Desktop
- Esperar a que inicie completamente
- Ejecutar nuevamente:

```bash
docker ps
```

---

## Error de puertos ocupados

Cambiar los puertos en:

```txt
docker-compose.yml
```

---

## Limpiar y reconstruir todo

```bash
docker compose down
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
