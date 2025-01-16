import { DataTypes, literal, Model, Optional } from "sequelize";
import { userActivityAttributes } from "./userActivity";
import sequelize from "../setup/database";

export interface userAttributes {
  id: string;
  roleId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string | null;
  passwordHash?: string | null;
  passwordSetOn?: Date;
  createdOn: Date;
  createdBy?: string | null;
  lastLoggedInOn?: Date;
  isDeleted?: boolean;
  deletedOn?: Date;
  deletedBy?: string;
  activationStatus?: boolean;
  activationStatusUpdatedOn?: Date;
  activationStatusUpdatedBy?: string;
  sessionId?: string | null;
}

interface userCreationAttributes extends Optional<userAttributes, "id"> { }

interface userInstance
  extends Model<userAttributes, userCreationAttributes>,
  userAttributes {
  userActivity: userActivityAttributes;
}

const user = sequelize.define<userInstance>(
  "users",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: literal("gen_random_uuid()"),
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    phone: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    createdOn: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdBy: {
      type: DataTypes.UUID,
    },
    lastLoggedInOn: {
      type: DataTypes.DATE,
    },
    isDeleted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deletedOn: {
      type: DataTypes.DATE,
    },
    deletedBy: {
      type: DataTypes.UUID,
    },
    activationStatus: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    activationStatusUpdatedOn: {
      type: DataTypes.DATE,
    },
    activationStatusUpdatedBy: {
      type: DataTypes.UUID,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    passwordHash: {
      type: DataTypes.STRING(255),
    },
    passwordSetOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sessionId: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default user;
