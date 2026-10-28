-- =========================================================================
-- Script SQL para insertar usuarios de prueba y ubicaciones iniciales para GeoTracker
-- =========================================================================

-- 1. Insertar Usuarios
INSERT INTO "usuarios" (
    "id", "nombre", "apellido", "email", "usuario", "contrasena",
    "telefono", "rol", "createdAt", "updatedAt"
) VALUES 
(
    1, 'Administrador', 'GeoTracker', 'admin@geotracker.com', 'admin', 'admin123',
    '55551234', 'user', NOW(), NOW()
),
(
    2, 'Elvis', 'Chang', 'elvis@geotracker.com', 'elvis', '123456',
    '55554321', 'user', NOW(), NOW()
),
(
    3, 'Estudiante', 'UDV', 'estudiante@geotracker.com', 'estudiante', '123456',
    '55559876', 'user', NOW(), NOW()
)
ON CONFLICT ("usuario") DO NOTHING;

-- Asegurar secuencia de IDs para usuarios
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), COALESCE(MAX(id), 1)) FROM "usuarios";

-- 2. Insertar Ubicaciones de ejemplo para el usuario id = 1 y 2
INSERT INTO "ubicaciones" (
    "nombre", "descripcion", "latitud", "longitud", "usuarioId", "createdAt", "updatedAt"
) VALUES
(
    'Universidad Da Vinci de Guatemala',
    'Sede central universitaria - Campus de estudios de ingeniería',
    14.603816,
    -90.513275,
    1,
    NOW(),
    NOW()
),
(
    'Plaza de la Constitución',
    'Parque Central y Palacio Nacional de la Cultura, Zona 1',
    14.641656,
    -90.513271,
    1,
    NOW(),
    NOW()
),
(
    'Paseo Cayalá',
    'Centro urbano y comercial con áreas verdes, Zona 16',
    14.611942,
    -90.485292,
    1,
    NOW(),
    NOW()
),
(
    'Universidad Da Vinci de Guatemala',
    'Sede central universitaria - Campus de estudios de ingeniería',
    14.603816,
    -90.513275,
    2,
    NOW(),
    NOW()
);
