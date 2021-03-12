// import express from 'express';
// import cors from 'cors';
// const app = express();
// app.use('/login', (req, res) => {
//     res.send({
//         token: 'test123'
//     });
// });
// app.listen(8080, () => console.log('API is running on http://localhost:8080/login'));
var PORT = 4000;
var io = require("socket.io")(PORT);
io.on("connection", function (socket) {
    socket.send("hello");
    socket.emit("greetings", "hello", "param2", "param3", "param4");
    socket.on("message", function (data) {
        console.log({ data: data });
    });
    socket.on("salutations", function (params) {
        console.log.apply(console, params);
    });
});
