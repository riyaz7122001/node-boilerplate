"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const userPassword = database_1.default.define('userPassword', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    userId: {
        allowNull: true,
        type: sequelize_1.DataTypes.UUID,
    },
    passwordHash: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(255),
    },
    createdOn: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    tableName: 'userPassword',
    timestamps: false,
});
exports.default = userPassword;
