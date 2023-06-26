const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http').Server(app);

const socketIO = require('socket.io')(http, {
    cors: {
        origin: true,
    }
});

let users = [];

socketIO.on('connection', (socket) => {
    console.log(socket.id + " has connected!");

    socket.on('disconnect', ()=> {
        users = users.filter((el) => el.id != socket.id);
        socketIO.emit('LoggedUsers', users);
    });

    socket.on('message', (data) => {
        socketIO.emit('messageResponse', data);
    });

    socket.on('userLogin', (data) => {
        users.push(data);
        socketIO.emit('LoggedUsers', users);
    });

    socket.on('typing', (data) => {
        socketIO.emit('typing', data);
    })

    socket.on('notTyping', (data) => {
        socketIO.emit('notTyping', data)
    })
});

app.get('/api', (req, res) => {
    return res.json({
        message: "[200] OK"
    });
});

app.use(cors());

http.listen(3000, () => {
    console.log("Listening on port 3000")
});