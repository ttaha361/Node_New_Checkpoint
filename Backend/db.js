const pgp = require('pg-promise')();
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

module.exports = {
  one: (text, params) => db.one(text, params),
  none: (text, params) => db.none(text, params),
  any: (text, params) => db.any(text, params),
};
