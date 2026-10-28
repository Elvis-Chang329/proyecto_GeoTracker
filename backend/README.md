# GeoTracker - Backend REST API (Evaluación Parcial II)

Backend desarrollado en **Node.js**, **TypeScript**, **Express**, **Sequelize** y **PostgreSQL** para la aplicación móvil Android **GeoTracker** (Universidad Da Vinci de Guatemala).

---

## 🎯 Cumplimiento de Lineamientos del Examen

| Requerimiento | Endpoint / Solución | Estado |
|---|---|---|
| **1. Login & Token (15 pts)** | `POST /api/auth/login` con generación de JWT | ✅ Implementado |
| **2. Captura de ubicaciones (25 pts)** | `POST /api/ubicaciones` (nombre, descripcion, latitud, longitud) | ✅ Implementado |
| **3. Listado de ubicaciones (20 pts)** | `GET /api/ubicaciones` (filtra únicamente las del usuario autenticado) | ✅ Implementado |
| **4. Visualización en mapa (20 pts)** | Marcadores con `latitud` y `longitud` numéricos | ✅ Implementado |
| **5. Dialog Material 3 (10 pts)** | Retorna nombre, descripción, coordenadas y fecha | ✅ Implementado |
| **6. Endpoints y tabla BD (10 pts)** | Modelo `ubicaciones` asociado a `usuarios` con llave foránea y validación de token | ✅ Implementado |

---

## 🚀 Cómo Iniciar el Backend

### Con Docker Compose:
```bash
docker compose up -d --build
```

### En Desarrollo Local:
```bash
npm install
npm run build
npm run dev
```

El servidor estará escuchando en el puerto `3000`.

---

## 📱 Conexión desde la Aplicación Android (Retrofit)

- **En Emulador Android:**
  ```kotlin
  const val BASE_URL = "http://10.0.2.2:3000/"
  ```
- **En AWS EC2 (o Dispositivo Físico):**
  ```kotlin
  const val BASE_URL = "http://<IP_PUBLICA_EC2>:3000/"
  ```

---

## 👤 Usuarios Disponibles para Pruebas

Al iniciar el servidor, se cargan automáticamente los **8 usuarios** que se han venido trabajando (incluyendo los 6 administradores originales de clase):

| Nombre y Apellido | Usuario | Contraseña | Correo Electrónico |
|---|---|---|---|
| Carlos Ramírez | `admin` | `admin123` | `carlos.admin@censos.gob` |
| Elvis Chang | `admin_elvis` | `admin123` | `elvis.admin@censos.gob` |
| Elvis Chang | `elvis` | `123456` | `elvis@geotracker.com` |
| Sofía Morales | `admin_sofia` | `admin123` | `sofia.admin@censos.gob` |
| Fernando López | `admin_fernando` | `admin123` | `fernando.admin@censos.gob` |
| Valeria Gómez | `admin_valeria` | `admin123` | `valeria.admin@censos.gob` |
| Miguel Ángel Castillo | `admin_miguel` | `admin123` | `miguel.admin@censos.gob` |
| Estudiante UDV | `estudiante` | `123456` | `estudiante@geotracker.com` |

> *Nota: Puedes iniciar sesión usando tanto el **nombre de usuario** como el **correo electrónico**.*

---

## 📚 Endpoints Principales

### 1. Autenticación
- **POST `/api/auth/login`**: Iniciar sesión. Retorna el token JWT.
  ```json
  {
    "usuario": "admin",
    "contrasena": "admin123"
  }
  ```
- **POST `/api/auth/register`**: Registrar nuevo usuario.

### 2. Ubicaciones (Requieren cabecera `Authorization: Bearer <TOKEN>`)
- **POST `/api/ubicaciones`**: Guardar una ubicación.
  ```json
  {
    "nombre": "Parque Central",
    "descripcion": "Punto de encuentro",
    "latitud": 14.641656,
    "longitud": -90.513271
  }
  ```
- **GET `/api/ubicaciones`**: Obtener todas las ubicaciones del usuario autenticado (para lista de tarjetas y marcadores de mapa).
- **GET `/api/ubicaciones/:id`**: Obtener detalle de una ubicación.
- **DELETE `/api/ubicaciones/:id`**: Eliminar una ubicación.
