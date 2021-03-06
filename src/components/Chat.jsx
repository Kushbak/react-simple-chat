import { useEffect, useRef, useState } from 'react'
import socket from '../socket'

const Chat = (props) => {
    const [message, setMessage] = useState('')
    const messagesRef = useRef(null)

    const onSend = (e) => {
        e.preventDefault()
        socket.emit('ROOM:NEW_MESAGE', {
            roomId: props.roomId,
            message,
            username: props.username,
        })
        props.addMessage({
            message,
            username: props.username,
        })
        setMessage('')
    }

    useEffect(() => {
        messagesRef.current.scrollTo(0, 999990)
    }, [props.messages])

    return (
        <div className='chatPage'>
            <div className="usersBlock">
                <p className='room'>Комната: <b>{props.roomId}</b></p>
                <h4>Онлайн({props.users.length})</h4>
                {props.users.map((user, index) => (
                    <p className='user' key={user + index}>{user}</p>
                ))}
            </div>
            <div className="messagesBlock">
                <div className="messages" ref={messagesRef}>
                    {props.messages.map((message, index) => (
                        <div className={"message " + (message.username === props.username ? 'myMsg' : undefined)}>
                            <p className='messageText' key={message+index}>{message.message}</p>
                            <p className="messageAuthor">{message.username}</p>
                        </div>
                    ))}
                </div>

                <form className='sendMsgForm' onSubmit={onSend}>
                    <textarea rows="3" value={message} onChange={e => setMessage(e.target.value)} />
                    <button type='submit'>Отправить</button>
                </form>
            </div>
        </div>
    )
}

export default Chat
