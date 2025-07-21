import { Client } from '@stomp/stompjs'
import axios from 'axios'
import React, { use, useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'

export default function Subscriber() {
    const [isConnected, setIsConnected] = useState(false)
    const stompClientRef = useRef(null)
    const [message, setMessage] = useState({
        sender: '',
        content: ''
    })
    const [lmessages, setLMessages] = useState([])

    useEffect(()=>{
        axios.get('http://localhost:8080/list')
            .then(response => {
                console.log('List messages:', response.data);
                setLMessages(response.data);
            })
            .catch(error => {
                console.error('Error fetching list messages:', error);
            }); // this will fetch the list messages from the server for initial load
        const socketURL = "http://localhost:8080/ws"
        const client = new Client({
            webSocketFactory: ()=> new SockJS(socketURL),
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000,
            reconnectDelay: 5000,
            debug: (d)=>{
                console.debug("STOMP debug",d)
            }
        })

        client.onConnect = (frame) => {
            console.log("STOMP connected", frame)
            setIsConnected(true)

            client.subscribe("/topic/receive", (response)=> {
                console.log('Received message:', response.body);
                setMessage((prev)=> JSON.parse(response.body))
            })

            client.subscribe("/topic/list", (response)=> {
                console.log('Received list message:', response.body);
                setLMessages((prev) => JSON.parse(response.body))
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

        

        return ()=> {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.disconnect()
            }
        }
    },[])

    useEffect(() => {
        console.log(lmessages[0])
    }, [lmessages]);
  return (
    <div>
        <h2>Subscriber</h2>
        <div className='border-2 p-2 mb-4'>
            <h3>Simple message</h3>
            <div>
                <p>Sender: {message.sender}</p>
                <p>Content: {message.content}</p>
            </div>
        </div>
        <div className='border-2 p-2 mb-4'>
            <h2>List message</h2>
            <div className='flex flex-col gap-2'>
            {
                lmessages.map((msg, index) => (
                    <div className='border-2 p-1 w-xl' key={index}>
                        <p>Sender: {msg.sender}</p>
                        <p>Content: {msg.content}</p>
                    </div>
                ))
            }
            </div>
        </div>
    </div>
  )
}
