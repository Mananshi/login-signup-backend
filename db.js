const parse = require('pg-connection-string').parse;
const config = parse(process.env.DATABASE_URL);
const Sequelize = require('sequelize');

const database = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
})

module.exports = database