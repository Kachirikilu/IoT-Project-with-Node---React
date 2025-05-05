import { Sequelize } from 'sequelize';

const db = new Sequelize('iot_react-node-js', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3308
});

export default db;