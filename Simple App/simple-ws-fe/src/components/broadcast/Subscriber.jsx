import { Client } from '@stomp/stompjs'
import React, { useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'

export default function Subscriber() {
    const [isConnected, setIsConnected] = useState(false)
    const stompClientRef = useRef(null)
    const [message, setMessage] = useState({
        sender: '',
        content: ''
    })

    useEffect(()=>{
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
  return (
    <div>
        <div>
            <h2>Subscriber</h2>
            <div>
                <p>Sender: {message.sender}</p>
                <p>Content: {message.content}</p>
            </div>
        </div>
    </div>
  )
}
