import { UUID } from "sequelize";
import {
  DATE,
  INTEGER,
  QueryInterface,
  QueryInterfaceCreateTableOptions,
  STRING,
} from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable(
      "tokens",
      {
        id: {
          type: INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        token: {
          type: STRING(255),
          allowNull: false,
        },
        userId: {
          type: UUID,
          allowNull: false,
          references: {
            model: {
              tableName: "users",
            },
            key: "id",
          },
        },
        typeId: {
          type: INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "tokenTypes",
            },
            key: "id",
          },
        },
        createdOn: {
          type: DATE,
          allowNull: false,
        },
      },
      {
        tableName: "tokens",
        timestamps: false,
      } as QueryInterfaceCreateTableOptions
    );

    await queryInterface.addIndex(
      {
        tableName: "tokens",
      },
      {
        fields: ["token", "typeId"],
      }
    );
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable({
      tableName: "tokens",
    });
  },
};
