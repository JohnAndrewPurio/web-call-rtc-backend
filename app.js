const { Socket } = require('dgram')
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { port } = require('./config')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

const onlineUsers = []

io.on('connection', connectionHandler)

app.set('port', port)

httpServer.listen( app.get('port'), () => {
    const port = httpServer.address().port

    console.log("Server is listening at port", port)
})

function connectionHandler(socket) {
    console.log('Client Connected:', socket.id)

    

    socket.on('logIn', (name) => {
        onlineUsers.push({
            name: name,
            _id: socket.id
        })

        io.emit('onlineUsers', onlineUsers)
    })

    socket.on('disconnect', () => {
        onlineUsers.splice( onlineUsers.indexOf( onlineUsers.find( user => user._id === socket.id ) ), 1 )
        io.emit('onlineUsers', onlineUsers)
        console.log('Disconnected')
    })
}