import { Router } from 'express';
import { 
    createUbicacion, 
    getUbicaciones, 
    getUbicacionById, 
    deleteUbicacion 
} from '../controllers/ubicacion.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas de ubicaciones requieren validación de token JWT (Punto 6.c del proyecto)
router.use(authenticateToken);

// 6.a & 2. Guardar ubicación: recibe nombre, descripcion, latitud, longitud
router.post('/', createUbicacion);

// 6.b, 3 & 4. Obtener listado de ubicaciones del usuario autenticado (para lista y para mapa)
router.get('/', getUbicaciones);

// Obtener detalle de una ubicación por ID
router.get('/:id', getUbicacionById);

// Eliminar ubicación por ID
router.delete('/:id', deleteUbicacion);

export default router;
