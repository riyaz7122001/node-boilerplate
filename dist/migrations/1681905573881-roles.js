"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('roles', {
            id: {
                type: sequelize_1.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            role: {
                type: (0, sequelize_1.STRING)(50),
                allowNull: false,
                unique: true
            }
        }, {
            tableName: 'roles',
            timestamps: false
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable({
            tableName: 'roles'
        });
    }
};
