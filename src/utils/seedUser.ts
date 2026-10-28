import User from '../models/user.model';
import Ubicacion from '../models/ubicacion.model';
import bcrypt from 'bcryptjs';

const DEFAULT_USERS = [
    {
        nombre: 'Carlos',
        apellido: 'Ramírez',
        email: 'carlos.admin@censos.gob',
        usuario: 'admin',
        contrasena: 'admin123',
    },
    {
        nombre: 'Elvis',
        apellido: 'Chang',
        email: 'elvis.admin@censos.gob',
        usuario: 'admin_elvis',
        contrasena: 'admin123',
    },
    {
        nombre: 'Elvis',
        apellido: 'Chang',
        email: 'elvis@geotracker.com',
        usuario: 'elvis',
        contrasena: '123456',
    },
    {
        nombre: 'Sofía',
        apellido: 'Morales',
        email: 'sofia.admin@censos.gob',
        usuario: 'admin_sofia',
        contrasena: 'admin123',
    },
    {
        nombre: 'Fernando',
        apellido: 'López',
        email: 'fernando.admin@censos.gob',
        usuario: 'admin_fernando',
        contrasena: 'admin123',
    },
    {
        nombre: 'Valeria',
        apellido: 'Gómez',
        email: 'valeria.admin@censos.gob',
        usuario: 'admin_valeria',
        contrasena: 'admin123',
    },
    {
        nombre: 'Miguel Ángel',
        apellido: 'Castillo',
        email: 'miguel.admin@censos.gob',
        usuario: 'admin_miguel',
        contrasena: 'admin123',
    },
    {
        nombre: 'Estudiante',
        apellido: 'UDV',
        email: 'estudiante@geotracker.com',
        usuario: 'estudiante',
        contrasena: '123456',
    }
];

const SAMPLE_LOCATIONS = [
    {
        nombre: 'Universidad Da Vinci de Guatemala',
        descripcion: 'Sede central universitaria - Campus de estudios de ingeniería',
        latitud: 14.603816,
        longitud: -90.513275,
    },
    {
        nombre: 'Plaza de la Constitución',
        descripcion: 'Parque Central y Palacio Nacional de la Cultura, Zona 1',
        latitud: 14.641656,
        longitud: -90.513271,
    },
    {
        nombre: 'Paseo Cayalá',
        descripcion: 'Centro urbano y comercial con áreas verdes, Zona 16',
        latitud: 14.611942,
        longitud: -90.485292,
    },
    {
        nombre: 'Mirador Carretera a El Salvador',
        descripcion: 'Vista panorámica del valle de la Ciudad de Guatemala',
        latitud: 14.569420,
        longitud: -90.478912,
    }
];

export const seedInitialData = async () => {
    try {
        for (const userData of DEFAULT_USERS) {
            let user = await User.findOne({
                where: { usuario: userData.usuario }
            });

            if (!user) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(userData.contrasena, salt);

                user = await User.create({
                    nombre: userData.nombre,
                    apellido: userData.apellido,
                    email: userData.email,
                    usuario: userData.usuario,
                    contrasena: hashedPassword,
                });
                console.log(`✅ Usuario creado: ${userData.usuario} (${userData.email}) - Pass: ${userData.contrasena}`);
            }

            // Asignar ubicaciones de prueba a los usuarios principales para visualización inmediata en Android
            const count = await Ubicacion.count({ where: { usuarioId: user.id } });
            if (count === 0) {
                const ubicacionesParaUsuario = SAMPLE_LOCATIONS.map(loc => ({
                    ...loc,
                    usuarioId: user.id,
                }));
                await Ubicacion.bulkCreate(ubicacionesParaUsuario);
                console.log(`📍 4 ubicaciones de prueba asignadas al usuario: ${user.usuario}`);
            }
        }
        console.log('✅ Verificación y carga de los 8 usuarios y ubicaciones completada.');
    } catch (error: any) {
        console.error('⚠️ Error al sembrar datos iniciales:', error.message);
    }
};
