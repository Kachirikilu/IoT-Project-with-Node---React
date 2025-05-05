import { Sequelize } from "sequelize";
import db from "../config/database.js";

const DataTypes = Sequelize;

const user_table = db.define('users', {
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
}, {
    freezeTableName: true
});

export default user_table;

(async()=>{
    await db.sync();
})();