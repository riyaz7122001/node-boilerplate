"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const secrets_1 = require("./secrets");
const sequelize = new sequelize_1.Sequelize(secrets_1.DB_NAME, secrets_1.DB_USER, secrets_1.DB_PASSWORD, {
    host: secrets_1.DB_HOST,
    port: Number(secrets_1.DB_PORT),
    dialect: "postgres",
    logging: console.log,
    pool: {
        max: Number(secrets_1.DB_MAX_CONNECTIONS_POOL),
        min: Number(secrets_1.DB_MIN_CONNECTIONS_POOL),
        acquire: Number(secrets_1.DB_ACCQUIRE_TIME),
        idle: Number(secrets_1.DB_IDLE_TIME),
    },
});
sequelize.authenticate()
    .then(() => console.log(`${process.pid}: Connection to database: ${secrets_1.DB_NAME} has been established successfully.`))
    .catch((error) => console.error(`${process.pid}: Unable to connect to database: ${secrets_1.DB_NAME} - ${error}`));
exports.default = sequelize;
