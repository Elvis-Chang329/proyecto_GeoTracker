import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

export interface UbicacionAttributes {
    id: number;
    nombre: string;
    descripcion?: string | null;
    latitud: number;
    longitud: number;
    usuarioId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UbicacionCreationAttributes extends Optional<UbicacionAttributes, 'id' | 'descripcion'> { }

class Ubicacion extends Model<UbicacionAttributes, UbicacionCreationAttributes> implements UbicacionAttributes {
    declare id: number;
    declare nombre: string;
    declare descripcion?: string | null;
    declare latitud: number;
    declare longitud: number;
    declare usuarioId: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Ubicacion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: '',
        },
        latitud: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
            get() {
                const val = this.getDataValue('latitud');
                return val === null ? null : parseFloat(val as any);
            },
        },
        longitud: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
            get() {
                const val = this.getDataValue('longitud');
                return val === null ? null : parseFloat(val as any);
            },
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'ubicaciones',
        timestamps: true,
    }
);

// Relaciones
Ubicacion.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });
User.hasMany(Ubicacion, { foreignKey: 'usuarioId', as: 'ubicaciones' });

export default Ubicacion;
