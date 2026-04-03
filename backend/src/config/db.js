const path = require('path');
const { Sequelize } = require('sequelize');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

require('dotenv').config({
  path: path.resolve(__dirname, '../../', envFile),
  override: true,
});

const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;

let sequelize;
if (dbUrl) {
  sequelize = new Sequelize(dbUrl, { dialect: 'mysql', logging: false });
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
  });
}

async function connectWithRetry(retries = 10, delayMs = 3000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      return;
    } catch (err) {
      attempt += 1;
      console.error(`Unable to connect to the database (attempt ${attempt}/${retries}):`, err.message || err);
      if (attempt >= retries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

module.exports = { sequelize, connectWithRetry };