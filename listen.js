// const app = require('./app')

// app.listen(8080, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("listening on 8080!")
//     }
// })


const app = require("./app");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));