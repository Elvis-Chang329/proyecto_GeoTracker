import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/auth.routes';
import ubicacionRoutes from './routes/ubicacion.routes';
import { seedInitialData } from './utils/seedUser';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz para verificación de estado del API
app.get('/', (req, res) => {
    res.json({
        success: true,
        project: 'GeoTracker API - Evaluación Parcial II',
        message: 'Servidor Backend activo y funcionando correctamente',
        endpoints: {
            auth: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register',
                profile: 'GET /api/auth/me (Requiere Bearer Token)',
            },
            ubicaciones: {
                guardar: 'POST /api/ubicaciones (Requiere Bearer Token)',
                listar: 'GET /api/ubicaciones (Requiere Bearer Token)',
                detalle: 'GET /api/ubicaciones/:id (Requiere Bearer Token)',
                eliminar: 'DELETE /api/ubicaciones/:id (Requiere Bearer Token)',
            },
        },
    });
});

// Rutas de la aplicación
app.use('/api/auth', authRoutes);
app.use('/api/ubicaciones', ubicacionRoutes);
app.use('/api/locations', ubicacionRoutes); // Alias en inglés para compatibilidad

const PORT = process.env.PORT || 3000;

const startServer = async (retries = 5, delayMs = 3000) => {
    while (retries > 0) {
        try {
            await sequelize.sync({ alter: true });
            console.log('✅ Base de datos sincronizada correctamente (Tablas: usuarios, ubicaciones)');

            // Sembrar usuarios y datos iniciales para pruebas
            await seedInitialData();

            app.listen(PORT, () => {
                console.log(`🚀 Servidor GeoTracker corriendo en el puerto ${PORT}`);
                console.log(`📍 Endpoint Login: POST http://localhost:${PORT}/api/auth/login`);
                console.log(`📍 Endpoint Ubicaciones: http://localhost:${PORT}/api/ubicaciones`);
            });
            return;
        } catch (err: any) {
            retries -= 1;
            console.error(`❌ Error al conectar con la base de datos (${err.message}). Reintentos restantes: ${retries}`);
            if (retries === 0) {
                console.error('No se pudo conectar a la base de datos tras múltiples intentos.');
                process.exit(1);
            }
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
};

startServer();