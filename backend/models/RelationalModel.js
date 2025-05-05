import { Sequelize } from "sequelize";
import db from "../config/database.js";

const DataTypes = Sequelize;

const user_table = db.define('users', {
    id_user: DataTypes.STRING,
    id_device: DataTypes.STRING,
}, {
    freezeTableName: true
});

export default user_table;

(async()=>{
    await db.sync();
})();