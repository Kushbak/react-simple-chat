import './App.css'
import Join from './components/Join'
import socket from './socket.js'
import reducer from './reducer'
import { useEffect, useReducer } from 'react'
import Chat from './components/Chat'
import axios from 'axios'

function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false, 
        username: null,
        roomId: null,
        users: [],
        messages: [],
    })

    const onLogin = async (data) => {
        dispatch({
            type: 'JOINED',
            payload: data
        })
        socket.emit('ROOM:JOIN', data)
        const res = await axios.get(`/rooms/${data.roomId}`)
        setUsers(res.data.users)
        dispatch({
            type: 'SET_MESSAGES',
            payload: res.data.messages
        })
    }

    const setUsers = (users) => {
        dispatch({
            type: 'SET_USERS',
            payload: users
        })
    }

    const addMessage = (message) => {
        dispatch({
            type: 'ADD_MESSAGE',
            payload: message
        })
    }

    useEffect(() => {
        socket.on('ROOM:JOINED', setUsers)
        socket.on('ROOM:LEAVED', setUsers)
        socket.on('ROOM:NEW_MESSAGE', addMessage)
    }, [])

    return (
        <div className="app">
            {
                !state.joined 
                ? <Join onLogin={onLogin}/>
                : <Chat {...state} addMessage={addMessage} />
            }
        </div>
    )
}

export default App
