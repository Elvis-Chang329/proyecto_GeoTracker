import { Request, Response } from 'express';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { generateToken, AuthRequest } from '../middleware/auth.middleware';

const sendResponse = (res: Response, statusCode: number, success: boolean, message: string, data: any = null, error: any = null) => {
    return res.status(statusCode).json({
        success,
        message,
        token: data?.token || null,
        data,
        error,
    });
};

/**
 * Registro de nuevo usuario para GeoTracker
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, email, usuario, contrasena } = req.body;
        const rawPassword = contrasena || req.body['contraseña'] || req.body.password;
        const rawUser = usuario || req.body.username;

        if (!nombre || !email || !rawUser || !rawPassword) {
            return sendResponse(
                res, 
                400, 
                false, 
                'Los campos nombre, email, usuario y contraseña son obligatorios', 
                null, 
                'MISSING_FIELDS'
            );
        }

        const cleanNombre = String(nombre).trim();
        const cleanApellido = apellido ? String(apellido).trim() : '';
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanUsuario = String(rawUser).trim();
        const cleanPassword = String(rawPassword).trim();

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            where: {
                usuario: { [Op.iLike]: cleanUsuario }
            }
        });
        if (existingUser) {
            return sendResponse(res, 400, false, 'El nombre de usuario ya está registrado', null, 'USER_EXISTS');
        }

        // Verificar si el correo ya existe
        const existingEmail = await User.findOne({
            where: {
                email: { [Op.iLike]: cleanEmail }
            }
        });
        if (existingEmail) {
            return sendResponse(res, 400, false, 'El correo electrónico ya está registrado', null, 'EMAIL_EXISTS');
        }

        // Hashear la contraseña para seguridad
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(cleanPassword, salt);

        const newUser = await User.create({
            nombre: cleanNombre,
            apellido: cleanApellido,
            email: cleanEmail,
            usuario: cleanUsuario,
            contrasena: hashedPassword,
        });

        const token = generateToken({
            id: newUser.id,
            usuario: newUser.usuario,
            email: newUser.email,
            nombre: newUser.nombre,
        });

        const userData = {
            id: newUser.id,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            usuario: newUser.usuario,
            email: newUser.email,
            token,
        };

        return sendResponse(res, 201, true, 'Usuario registrado exitosamente', userData);
    } catch (error: any) {
        console.error('[AUTH] Error en register:', error);
        return sendResponse(res, 500, false, 'Error interno al registrar usuario', null, error.message);
    }
};

/**
 * Inicio de sesión (Login)
 * Retorna token JWT obligatorio para todas las peticiones subsiguientes
 */
export const login = async (req: Request, res: Response) => {
    try {
        const userIdentifier = req.body.usuario || req.body.email || req.body.username || req.body.identifier;
        const pass = req.body.contrasena || req.body['contraseña'] || req.body.password;

        if (!userIdentifier || !pass) {
            return sendResponse(
                res, 
                400, 
                false, 
                'Debes ingresar usuario/correo y contraseña', 
                null, 
                'MISSING_CREDENTIALS'
            );
        }

        const cleanUser = String(userIdentifier).trim();
        const cleanPass = String(pass).trim();

        // Buscar por usuario o por email
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { usuario: { [Op.iLike]: cleanUser } },
                    { email: { [Op.iLike]: cleanUser } }
                ]
            }
        });

        if (!user) {
            return sendResponse(
                res, 
                401, 
                false, 
                'Credenciales incorrectas: usuario o correo no encontrado', 
                null, 
                'USER_NOT_FOUND'
            );
        }

        const passwordDB = String(user.contrasena).trim();

        // Soporta tanto contraseñas encriptadas (bcrypt) como contraseñas en texto plano
        let isMatch = (passwordDB === cleanPass);
        if (!isMatch && (passwordDB.startsWith('$2a$') || passwordDB.startsWith('$2b$') || passwordDB.startsWith('$2y$'))) {
            try {
                isMatch = bcrypt.compareSync(cleanPass, passwordDB);
            } catch (err) {
                isMatch = false;
            }
        }

        if (!isMatch) {
            return sendResponse(
                res, 
                401, 
                false, 
                'Credenciales incorrectas: contraseña no válida', 
                null, 
                'INVALID_PASSWORD'
            );
        }

        // Generar Token JWT
        const token = generateToken({
            id: user.id,
            usuario: user.usuario,
            email: user.email,
            nombre: user.nombre,
        });

        const userData = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            usuario: user.usuario,
            email: user.email,
            token,
        };

        return sendResponse(res, 200, true, 'Inicio de sesión exitoso', userData);
    } catch (error: any) {
        console.error('[AUTH] Error en login:', error);
        return sendResponse(res, 500, false, 'Error interno del servidor en inicio de sesión', null, error.message);
    }
};

/**
 * Obtener perfil del usuario autenticado actual mediante su token
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendResponse(res, 401, false, 'No autenticado', null, 'UNAUTHORIZED');
        }

        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'nombre', 'apellido', 'usuario', 'email', 'createdAt']
        });

        if (!user) {
            return sendResponse(res, 404, false, 'Usuario no encontrado', null, 'USER_NOT_FOUND');
        }

        return sendResponse(res, 200, true, 'Perfil de usuario obtenido', user);
    } catch (error: any) {
        console.error('[AUTH] Error en getProfile:', error);
        return sendResponse(res, 500, false, 'Error al obtener perfil', null, error.message);
    }
};