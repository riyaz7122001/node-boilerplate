"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    async up(queryInterface) {
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
    async down(queryInterface) {
        return queryInterface.bulkDelete({ tableName: "tokenTypes" }, {});
    },
};
