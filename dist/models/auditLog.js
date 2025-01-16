"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const auditLog = database_1.default.define('auditLog', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
    },
    url: {
        allowNull: false,
        type: sequelize_1.DataTypes.TEXT,
    },
    body: {
        allowNull: true,
        type: sequelize_1.DataTypes.TEXT,
    },
    ipAddress: {
        allowNull: true,
        type: sequelize_1.DataTypes.TEXT,
    },
    file: {
        allowNull: true,
        type: sequelize_1.DataTypes.TEXT,
    },
    userId: {
        allowNull: true,
        type: sequelize_1.DataTypes.UUID,
    },
    description: {
        allowNull: true,
        type: sequelize_1.DataTypes.TEXT,
    },
    createdOn: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    }
}, {
    tableName: 'auditLog',
    timestamps: false,
});
exports.default = auditLog;
