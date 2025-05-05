import { Sequelize } from "sequelize";
import db from "../config/database.js";

const DataTypes = Sequelize;

const device_table = db.define('devices', {
    slug: DataTypes.STRING,
    device: DataTypes.STRING,
    picture: DataTypes.STRING,
    information: DataTypes.STRING
}, {
    freezeTableName: true
});

export default device_table;

(async()=>{
    await db.sync();
})();