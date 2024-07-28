const { Client} = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    port: 5432,
    database: 'customers_app',
});
// const pool = new Pool({
//     connectionString: process.env.POSTGRES_URL + "?sslmode=require",
//   })
module.exports = client;
