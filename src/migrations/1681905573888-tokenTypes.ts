import { INTEGER, QueryInterface, QueryInterfaceCreateTableOptions, STRING } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable('tokenTypes', {
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            type: {
                type: STRING(25),
                allowNull: false,
                unique: true
            }
        }, {
            tableName: 'tokenTypes',
            timestamps: false
        } as QueryInterfaceCreateTableOptions)
    },


    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable({
            tableName: 'tokenTypes'
        });
    }
};