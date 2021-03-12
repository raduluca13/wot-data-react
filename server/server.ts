// import express from 'express';
// import cors from 'cors';
// const app = express();

// app.use('/login', (req, res) => {
//     res.send({
//         token: 'test123'
//     });
// });

// app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));



const PORT = 4000
const io = require("socket.io")(PORT)

io.on("connection", socket => {
    socket.send("hello")

    socket.emit("greetings", "hello", "param2", "param3", "param4")

    socket.on("message", data => {
        console.log({ data })
    })

    socket.on("salutations", (params) => {
        console.log(...params)
    })
})