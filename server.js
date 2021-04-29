const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.json())

const rooms = new Map()

app.get('/rooms/:roomId', (req, res) => {
    const { roomId } = req.params
    const obj = rooms.has(roomId)
        ? {
            users: [...rooms.get(roomId).get('users').values()],
            messages: [...rooms.get(roomId).get('messages').values()],
        }
        : { users: [], messages: [] }
    console.log('getting room\'s users')
    res.json(obj)
})

app.post('/rooms', (req, res) => {
    const { roomId, username } = req.body
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []],
        ]))
    }
    res.json([...rooms.keys()])
})

io.on('connection', socket => {
    socket.on('ROOM:JOIN', ({ roomId, username }) => {
        socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id, username)
        const users = [...rooms.get(roomId).get('users').values()]
        socket.broadcast.to(roomId).emit('ROOM:JOINED', users)
        console.log('connected', username)
    })

    socket.on('ROOM:NEW_MESAGE', ({ roomId, username, message }) => {
        rooms.get(roomId).get('messages').push({ message, username })
        socket.broadcast.emit('ROOM:NEW_MESSAGE', { roomId, username, message })
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()]
                socket.broadcast.to(roomId).emit('ROOM:LEAVED', users)
                console.log('disconnected')
            }
        })
    })

    console.log('user connected', socket.id)
})

server.listen(8888, (err) => {
    if (err) throw Error(err)
    console.log('Server is running!')
})