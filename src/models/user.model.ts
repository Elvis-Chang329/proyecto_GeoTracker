import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
    id: number;
    nombre: string;
    apellido?: string;
    email: string;
    usuario: string;
    contrasena: string;
    edad?: number | null;
    fechaNacimiento?: string | null;
    telefono?: string | null;
    rol?: string;
    foto?: string | null;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'apellido' | 'edad' | 'fechaNacimiento' | 'telefono' | 'rol' | 'foto'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare nombre: string;
    declare apellido?: string;
    declare email: string;
    declare usuario: string;
    declare contrasena: string;
    declare edad?: number | null;
    declare fechaNacimiento?: string | null;
    declare telefono?: string | null;
    declare rol?: string;
    declare foto?: string | null;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        usuario: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        contrasena: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        edad: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        fechaNacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        rol: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: 'user',
        },
        foto: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        timestamps: true,
    }
);

export default User;