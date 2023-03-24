const { Pool } = require("pg");

const PG_URI =
  "postgres://eynzawdr:tke75bk-QwCgTRLHvFvFl8G14U374K_O@batyr.db.elephantsql.com/eynzawdr";

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});

// schema defined in scripts/linkrecord_postgres_create.sql

// We export an object that contains a property called query,
// which is a function that returns the invocation of pool.query() after logging the query
// This will be required in the controllers to be the access point to the database
module.exports = {
  query: (text, params, callback) => {
    console.log("executed query", text); //DEBUG
    return pool.query(text, params, callback);
  },
};
