import axios from "axios"
import { useState } from "react"

const Join = (props) => {
    const [roomId, setRoomId] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {
        if(!roomId || !username) return alert('Неверные данные')
       
        const obj = { roomId, username }

        setLoading(true)
        await axios.post('/rooms', obj)
        props.onLogin(obj)
    }

    return (
        <div className='joinBlock'>
            <input 
                className='joinBlock__input' 
                type="text" 
                value={roomId} 
                onChange={e => setRoomId(e.target.value)} 
                placeholder='ID комнаты'
            />
            <input 
                className='joinBlock__input' 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                placeholder='Ваше имя' 
            />
            <button className='btn btn-dark' onClick={onSubmit} disabled={loading}>{loading ? 'Вход...' : 'Войти'}</button>
        </div>
    )
}

export default Join