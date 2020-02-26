const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))


io.on('connection', (socket) => {
    socket.emit('sayHello', 'Welcom!')
    socket.broadcast.emit('sayHello', 'A new user joined')
    
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        
        io.emit('viewMessage', message)
        callback('Messegae was delivered')
    })

    socket.on('disconnect', () => {
        io.emit('sayHello', 'User has left')
    })

    socket.on('shareLocation', (lat, lon, callback) => {
        socket.broadcast.emit('sayHello', `https://google.com/maps?q=${lat},${lon}`)
    })
})

server.listen(port, () => {
    console.log('Server is up on port ', port)
})