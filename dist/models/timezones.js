"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const timezone = database_1.default.define('timezones', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    timezone: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(100),
    }
}, {
    tableName: 'timezones',
    timestamps: false,
});
exports.default = timezone;
