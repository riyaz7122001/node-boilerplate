import { DataTypes, Model } from "sequelize";
import sequelize from "../setup/database";

export interface RoleAttributes {
    id: number;
    role: string;
}

interface RoleInstance extends Model<RoleAttributes>, RoleAttributes { }

const roles = sequelize.define<RoleInstance>(
    "roles",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        role: {
            allowNull: false,
            type: DataTypes.ENUM,
            values: ["admin", "user"],
        },
    },
    {
        tableName: "roles",
        timestamps: false,
    }
);

export default roles;
