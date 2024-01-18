const db = require("../db/connection")

exports.fetchAllUsers = () => {
    return db.query(`SELECT * FROM users`).then((users) => {
        return users.rows
    })
}

exports.fetchSpecificUser = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1
    `, [username]).then((user) => {
        if (user.rows.length === 0) {
            return Promise.reject({status: 404, msg: "username not found"})
        }
        return user.rows[0]
    })
}