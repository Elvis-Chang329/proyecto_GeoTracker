import User from '../models/user.model';
import Ubicacion from '../models/ubicacion.model';
import bcrypt from 'bcryptjs';

const DEFAULT_USERS = [
    {
        nombre: 'Administrador',
        apellido: 'GeoTracker',
        email: 'admin@geotracker.com',
        usuario: 'admin',
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
        nombre: 'Estudiante',
        apellido: 'UDV',
        email: 'estudiante@geotracker.com',
        usuario: 'estudiante',
        contrasena: '123456',
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
                console.log(`✅ Usuario creado para pruebas: ${userData.usuario} (contraseña: ${userData.contrasena})`);
            }

            // Si es el usuario admin y no tiene ubicaciones, agregar ubicaciones de ejemplo para pruebas en Android
            if (user.usuario === 'admin' || user.usuario === 'elvis') {
                const count = await Ubicacion.count({ where: { usuarioId: user.id } });
                if (count === 0) {
                    await Ubicacion.bulkCreate([
                        {
                            nombre: 'Universidad Da Vinci de Guatemala',
                            descripcion: 'Sede central universitaria - Campus de estudios de ingeniería',
                            latitud: 14.603816,
                            longitud: -90.513275,
                            usuarioId: user.id,
                        },
                        {
                            nombre: 'Plaza de la Constitución',
                            descripcion: 'Parque Central y Palacio Nacional de la Cultura, Zona 1',
                            latitud: 14.641656,
                            longitud: -90.513271,
                            usuarioId: user.id,
                        },
                        {
                            nombre: 'Paseo Cayalá',
                            descripcion: 'Centro urbano y comercial con áreas verdes, Zona 16',
                            latitud: 14.611942,
                            longitud: -90.485292,
                            usuarioId: user.id,
                        }
                    ]);
                    console.log(`📍 3 ubicaciones de prueba creadas para el usuario: ${user.usuario}`);
                }
            }
        }
        console.log('✅ Verificación y carga de datos iniciales completada.');
    } catch (error: any) {
        console.error('⚠️ Error al sembrar datos iniciales:', error.message);
    }
};
