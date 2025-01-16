import { INTEGER, QueryInterface, QueryInterfaceCreateTableOptions, STRING } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable('roles', {
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            role: {
                type: STRING(50),
                allowNull: false,
                unique: true
            }
        }, {
            tableName: 'roles',
            timestamps: false
        } as QueryInterfaceCreateTableOptions)
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable({
            tableName: 'roles'
        });
    }
};