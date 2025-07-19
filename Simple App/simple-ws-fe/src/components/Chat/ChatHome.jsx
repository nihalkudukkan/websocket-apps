import { Client } from '@stomp/stompjs'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import { webSocketBe } from '../../configuration/WSConfig'
import { Link } from 'react-router-dom'

export default function ChatHome() {
    const [isConnected, setIsConnected] = useState(false)
    const stompClientRef = useRef(null)
    const [newUser, setNewUser] = React.useState({
        username: ''
    })
    const [users, setUsers] = useState([])

    const handleAddUser = (e) => {
        e.preventDefault();
        console.log('Adding user:', newUser);
        stompClientRef.current.publish({
            destination: "/public/addUser",
            headers: {'content-type': 'application/json' },
            body: JSON.stringify(newUser)
        })
        setNewUser({
            username: ''
        }) // Reset the newUser state after adding
    }
        

    useEffect(() => {
        axios.get('http://localhost:8080/users')
            .then(response => {
                console.log('Available users:', response.data);
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            }); // this will fetch the list of available users from the server
        const socketURL = "http://localhost:8080/ws"
        const client = webSocketBe()
        client.onConnect = (frame) => {
            console.log("STOMP connected", frame)
            setIsConnected(true)

            client.subscribe("/topic/usersAvailable", (response) => {
                console.log('Received user list:', response.body);
                setUsers((prev) => JSON.parse(response.body))
            })
        }

        client.onWebSocketError = (error) => {
            console.error("WS error", error)
            isConnected(false)
        }

        client.onStompError = (error) => {
            console.error("STOMP error", error)
            isConnected(false)
        }

        client.onDisconnect = () => {
            console.error("STOMP disconnected", error)
            isConnected(false)
        }

        client.activate()
        stompClientRef.current = client

        return ()=> {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.deactivate()
            }
        }
    }, [])
  return (
    <div className='mx-auto w-sm md:w-md lg:w-lg p-2 border-2 border-black rounded-md'>
        <h2>ChatHome</h2>
        <div>
            <h3>Available users</h3>
            <div>
                {users.map((user, index) => (
                    <div key={index} className='m-3'>
                        <Link className='bg-green-700 p-2 rounded-sm text-white' to={`/chat/${user.username}`}>{user.username}</Link>
                    </div>
                ))}
            </div>
            <div>
                <h3>Add user</h3>
                <form onSubmit={handleAddUser} className='m-2'>
                    <input className='border-2 p-2 mr-1' type="text" placeholder="Username" value={newUser.username} onChange={(e)=>setNewUser({username:e.target.value})} />
                    <button className='cursor-pointer bg-slate-600 text-white p-2 rounded-sm' type="submit">Add User</button>
                </form>
            </div>
        </div>
    </div>
  )
}
