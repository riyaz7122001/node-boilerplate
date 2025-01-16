import { Sequelize } from "sequelize";
import { DB_ACCQUIRE_TIME, DB_HOST, DB_IDLE_TIME, DB_MAX_CONNECTIONS_POOL, DB_MIN_CONNECTIONS_POOL, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, } from "./secrets";

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "postgres",
  logging: console.log,
  pool: {
    max: Number(DB_MAX_CONNECTIONS_POOL),
    min: Number(DB_MIN_CONNECTIONS_POOL),
    acquire: Number(DB_ACCQUIRE_TIME),
    idle: Number(DB_IDLE_TIME),
  },
});

sequelize.authenticate()
  .then(() => console.log(`${process.pid}: Connection to database: ${DB_NAME} has been established successfully.`))
  .catch((error) => console.error(`${process.pid}: Unable to connect to database: ${DB_NAME} - ${error}`));

export default sequelize;
