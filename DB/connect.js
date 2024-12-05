const { Sequelize } = require("sequelize");

const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(
  path.join(__dirname, "../../ca.pem"),
  "utf8"
);
const connectionString = process.env.DATABASE_URL;

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  port: 15668,
  dialectOptions: {
    ssl: {
      key: privateKey,

      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
