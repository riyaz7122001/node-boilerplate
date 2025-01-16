import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../setup/database';

export interface UserPasswordAttributes {
    id: number;
    userId: string;
    passwordHash: string;
    createdOn: Date;
}

interface UserPasswordCreationAttributes
    extends Optional<UserPasswordAttributes, 'id'> { }

interface UserPasswordInstance
    extends Model<UserPasswordAttributes, UserPasswordCreationAttributes>,
    UserPasswordAttributes { }

const userPassword = sequelize.define<UserPasswordInstance>(
    'userPassword',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        userId: {
            allowNull: true,
            type: DataTypes.UUID,
        },
        passwordHash: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        createdOn: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        tableName: 'userPassword',
        timestamps: false,
    }
);

export default userPassword;