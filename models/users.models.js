const db = require("../db/connection")

exports.fetchAllUsers = () => {
    return db.query(`SELECT * FROM users`).then((users) => {
        console.log(users.rows)
        return users.rows
    })
}