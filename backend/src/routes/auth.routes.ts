import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Endpoint de Login (Punto 1 del proyecto)
// Recibe: usuario/email y contrasena -> Retorna Token JWT
router.post('/login', login);

// Endpoint de Registro de usuarios
router.post('/register', register);
router.post('/', register);

// Endpoint para validar el token y obtener datos del usuario actual
router.get('/me', authenticateToken, getProfile);

export default router;