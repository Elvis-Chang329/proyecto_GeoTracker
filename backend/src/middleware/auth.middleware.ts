import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'geotracker_secret_jwt_key_2024_secure';

export interface AuthUser {
    id: number;
    usuario: string;
    email: string;
    nombre?: string;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    if (!headerValue) {
        return res.status(401).json({
            success: false,
            message: 'Token de autenticación no proporcionado en la cabecera Authorization',
            data: null,
            error: 'MISSING_TOKEN',
        });
    }

    // Soporta tanto "Bearer <token>" como "<token>" directo
    const token = headerValue.startsWith('Bearer ')
        ? headerValue.substring(7).trim()
        : headerValue.trim();

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Formato de token no válido',
            data: null,
            error: 'INVALID_TOKEN_FORMAT',
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        req.user = decoded;
        next();
    } catch (err: any) {
        console.error('[AUTH MIDDLEWARE] Error al verificar token:', err.message);
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
            data: null,
            error: 'INVALID_OR_EXPIRED_TOKEN',
        });
    }
};

export const generateToken = (payload: AuthUser): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};
