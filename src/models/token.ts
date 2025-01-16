import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../setup/database';

interface TokenAttributes {
    id: number;
    token: string;
    userId: string;
    typeId: number;
    createdOn: Date;
}

interface TokenCreationAttributes
    extends Optional<TokenAttributes, 'id'> { }

interface TokenInstance
    extends Model<TokenAttributes, TokenCreationAttributes>,
    TokenAttributes { }

const token = sequelize.define<TokenInstance>(
    'tokens',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        token: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        userId: {
            allowNull: false,
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        typeId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'tokenTypes',
                key: 'id',
            },
        },
        createdOn: {
            allowNull: false,
            type: DataTypes.DATE,
        }
    },
    {
        tableName: 'tokens',
        timestamps: false,
    }
);

export default token;
