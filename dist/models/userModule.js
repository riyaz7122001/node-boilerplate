"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const userModule = database_1.default.define('userModules', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    userId: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID
    },
    moduleId: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'modules',
            key: 'id',
        },
    },
    viewAccess: {
        allowNull: false,
        defaultValue: false,
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    addAccess: {
        allowNull: false,
        defaultValue: false,
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    editAccess: {
        allowNull: false,
        defaultValue: false,
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    deleteAccess: {
        allowNull: false,
        defaultValue: false,
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    activeDeactiveAccess: {
        allowNull: false,
        defaultValue: false,
        type: sequelize_1.DataTypes.BOOLEAN,
    }
}, {
    tableName: 'userModules',
    timestamps: false,
});
exports.default = userModule;
