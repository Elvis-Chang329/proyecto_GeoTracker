import { Response } from 'express';
import Ubicacion from '../models/ubicacion.model';
import { AuthRequest } from '../middleware/auth.middleware';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null, error: any = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        error,
    });
};

/**
 * Endpoint para guardar una ubicación (Punto 2 y 6.a del proyecto)
 * Recibe: nombre, descripcion, latitud, longitud
 * Valida autenticación y asocia la ubicación al usuario autenticado
 */
export const createUbicacion = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendResponse(res, 401, false, 'Usuario no autenticado', null, 'UNAUTHORIZED');
        }

        // Compatibilidad con diferentes nombres de campos comunes
        const nombre = req.body.nombre || req.body.name || req.body.titulo;
        const descripcion = req.body.descripcion ?? req.body.description ?? req.body.detalle ?? '';
        const latitud = req.body.latitud ?? req.body.latitude ?? req.body.lat;
        const longitud = req.body.longitud ?? req.body.longitude ?? req.body.lng ?? req.body.lon;

        if (!nombre || String(nombre).trim().length === 0) {
            return sendResponse(
                res, 
                400, 
                false, 
                'El nombre de la ubicación es obligatorio', 
                null, 
                'MISSING_NAME'
            );
        }

        if (latitud === undefined || longitud === undefined || isNaN(Number(latitud)) || isNaN(Number(longitud))) {
            return sendResponse(
                res, 
                400, 
                false, 
                'Las coordenadas GPS (latitud y longitud) son obligatorias y deben ser números válidos', 
                null, 
                'INVALID_COORDINATES'
            );
        }

        const lat = Number(latitud);
        const lng = Number(longitud);

        // Validación de rango de coordenadas GPS
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            return sendResponse(
                res, 
                400, 
                false, 
                'Coordenadas fuera de rango válido (-90 <= lat <= 90, -180 <= lng <= 180)', 
                null, 
                'OUT_OF_RANGE_COORDINATES'
            );
        }

        const nuevaUbicacion = await Ubicacion.create({
            nombre: String(nombre).trim(),
            descripcion: String(descripcion).trim(),
            latitud: lat,
            longitud: lng,
            usuarioId: req.user.id,
        });

        console.log(`[UBICACION] Nueva ubicación creada ID: ${nuevaUbicacion.id} para usuario ${req.user.usuario}`);

        return sendResponse(res, 201, true, 'Ubicación guardada exitosamente', nuevaUbicacion);
    } catch (error: any) {
        console.error('[UBICACION] Error en createUbicacion:', error);
        return sendResponse(res, 500, false, 'Error interno al guardar la ubicación', null, error.message);
    }
};

/**
 * Endpoint para obtener las ubicaciones del usuario autenticado (Puntos 3, 4 y 6.b)
 * Retorna todas las ubicaciones pertenecientes únicamente al usuario logueado
 */
export const getUbicaciones = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendResponse(res, 401, false, 'Usuario no autenticado', null, 'UNAUTHORIZED');
        }

        const ubicaciones = await Ubicacion.findAll({
            where: {
                usuarioId: req.user.id,
            },
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            success: true,
            message: 'Ubicaciones obtenidas exitosamente',
            count: ubicaciones.length,
            data: ubicaciones,
        });
    } catch (error: any) {
        console.error('[UBICACION] Error en getUbicaciones:', error);
        return sendResponse(res, 500, false, 'Error al obtener ubicaciones', null, error.message);
    }
};

/**
 * Obtener una ubicación específica por ID (Solo si pertenece al usuario autenticado)
 */
export const getUbicacionById = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendResponse(res, 401, false, 'Usuario no autenticado', null, 'UNAUTHORIZED');
        }

        const { id } = req.params;
        const ubicacion = await Ubicacion.findOne({
            where: {
                id: Number(id),
                usuarioId: req.user.id,
            },
        });

        if (!ubicacion) {
            return sendResponse(res, 404, false, 'Ubicación no encontrada o no pertenece al usuario', null, 'LOCATION_NOT_FOUND');
        }

        return sendResponse(res, 200, true, 'Ubicación obtenida exitosamente', ubicacion);
    } catch (error: any) {
        console.error('[UBICACION] Error en getUbicacionById:', error);
        return sendResponse(res, 500, false, 'Error al consultar la ubicación', null, error.message);
    }
};

/**
 * Eliminar una ubicación por ID (Solo si pertenece al usuario autenticado)
 */
export const deleteUbicacion = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendResponse(res, 401, false, 'Usuario no autenticado', null, 'UNAUTHORIZED');
        }

        const { id } = req.params;
        const ubicacion = await Ubicacion.findOne({
            where: {
                id: Number(id),
                usuarioId: req.user.id,
            },
        });

        if (!ubicacion) {
            return sendResponse(res, 404, false, 'Ubicación no encontrada o no pertenece al usuario', null, 'LOCATION_NOT_FOUND');
        }

        await ubicacion.destroy();

        return sendResponse(res, 200, true, 'Ubicación eliminada exitosamente', { id: Number(id) });
    } catch (error: any) {
        console.error('[UBICACION] Error en deleteUbicacion:', error);
        return sendResponse(res, 500, false, 'Error al eliminar la ubicación', null, error.message);
    }
};
