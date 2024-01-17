const db = require("../db/connection")

exports.fetchAllUsers = () => {
    return db.query(`SELECT * FROM users`).then((users) => {
        return users.rows
    })
}