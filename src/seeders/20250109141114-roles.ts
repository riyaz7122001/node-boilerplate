import { QueryInterface } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert({ tableName: "roles" }, [
      {
        role: "admin",
      },
      {
        role: "user",
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete({ tableName: "roles" }, {});
  },
};
