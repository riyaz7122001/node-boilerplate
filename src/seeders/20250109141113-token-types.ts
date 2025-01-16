import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert({ tableName: "tokenTypes" }, [
      {
        type: "refresh",
      },
      {
        type: "reset-password",
      },
      {
        type: "set-password",
      },
      {
        type: "verify-email",
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete({ tableName: "tokenTypes" }, {});
  },
};
