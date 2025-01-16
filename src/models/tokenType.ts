import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../setup/database';

interface TokenTypeAttributes {
    id: number;
    type: string;
}

interface TokenTypeCreationAttributes
    extends Optional<TokenTypeAttributes, 'id'> { }

interface TokenTypeInstance
    extends Model<TokenTypeAttributes, TokenTypeCreationAttributes>,
    TokenTypeAttributes { }

const tokenType = sequelize.define<TokenTypeInstance>(
    'tokenTypes',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        type: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(25),
        },
    },
    {
        tableName: 'tokenTypes',
        timestamps: false,
    }
);

export default tokenType;
