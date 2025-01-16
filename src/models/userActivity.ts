import { DataTypes, literal, Model, Optional } from "sequelize";
import sequelize from "../setup/database";

export interface userActivityAttributes {
    id?: string;
    userId: string;
    lastActivityOn: Date;
}

interface userActivityCreationAttributes
    extends Optional<userActivityAttributes, 'id'> { }

interface userActivityInstance
    extends Model<userActivityAttributes, userActivityCreationAttributes>,
    userActivityAttributes { }

const userActivity = sequelize.define<userActivityInstance>(
    'userActivity',
    {
        id: {
            primaryKey: true,
            defaultValue: literal('gen_random_uuid()'),
            type: DataTypes.UUID,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: {
                    tableName: 'users'
                },
                key: 'id'
            }
        },
        lastActivityOn: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        tableName: 'userActivity',
        timestamps: false,
    }
);

export default userActivity;