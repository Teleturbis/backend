const { Client } = require("pg");

const client = new Client({
  host: "kandula.db.elephantsql.com",
  user: "vazrhzjv",
  port: 5432,
  password: "BsHRcYP7-8o7Goisd-kJ_-uZB2ZbbYIW",
  database: "vazrhzjv",
});

module.exports = client;
