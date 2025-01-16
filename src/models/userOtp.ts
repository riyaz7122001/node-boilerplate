import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../setup/database';

export interface UserOtpAttributes {
    id: number;
    userId: string;
    otp: string;
    createdOn: Date;
}

interface UserOtpCreationAttributes
    extends Optional<UserOtpAttributes, 'id'> { }

interface UserOtpInstance
    extends Model<UserOtpAttributes, UserOtpCreationAttributes>,
    UserOtpAttributes { }

const userOtp = sequelize.define<UserOtpInstance>(
    'userOtp',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        userId: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        otp: {
            allowNull: false,
            type: DataTypes.STRING(6),
        },
        createdOn: {
            allowNull: false,
            type: DataTypes.DATE,
        }
    },
    {
        tableName: 'userOtp',
        timestamps: false,
    }
);

export default userOtp;
