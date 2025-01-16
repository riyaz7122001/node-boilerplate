"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable("tokens", {
            id: {
                type: sequelize_2.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            token: {
                type: (0, sequelize_2.STRING)(255),
                allowNull: false,
            },
            userId: {
                type: sequelize_1.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: "users",
                    },
                    key: "id",
                },
            },
            typeId: {
                type: sequelize_2.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: "tokenTypes",
                    },
                    key: "id",
                },
            },
            createdOn: {
                type: sequelize_2.DATE,
                allowNull: false,
            },
        }, {
            tableName: "tokens",
            timestamps: false,
        });
        await queryInterface.addIndex({
            tableName: "tokens",
        }, {
            fields: ["token", "typeId"],
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable({
            tableName: "tokens",
        });
    },
};
