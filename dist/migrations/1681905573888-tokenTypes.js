"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('tokenTypes', {
            id: {
                type: sequelize_1.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            type: {
                type: (0, sequelize_1.STRING)(25),
                allowNull: false,
                unique: true
            }
        }, {
            tableName: 'tokenTypes',
            timestamps: false
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable({
            tableName: 'tokenTypes'
        });
    }
};
