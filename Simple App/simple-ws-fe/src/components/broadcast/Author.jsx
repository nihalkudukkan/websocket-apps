import { Client } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react'
import SockJS from 'sockjs-client';

export default function Author() {
    const [isConnected, setIsConnected] = useState(false)
    const stompClientRef = React.useRef(null);
    const [messages, setMessages] = React.useState({
        sender: '',
        content: ''
    });

    const [lmessages, setLMessages] = React.useState({
        sender: '',
        content: ''
    });

    useEffect(()=>{
        const socketUrl = "http://localhost:8080/ws"

        const client = new Client({
            webSocketFactory: ()=> new SockJS(socketUrl),
            heartbeatIncoming: 5000,
            heartbeatOutgoing: 5000,
            reconnectDelay: 5000,
            debug: (str)=> {
                console.log("STOMP Debug:", str)
            }
        })

        client.onConnect = (frame) => {
            console.log("STOMP connected", frame);
            setIsConnected(true)
        }

        client.onStompError = (error) => {
            console.error("STOMP connection error", error);
            setIsConnected(true)
        }

        client.onWebSocketError = (error) => {
            console.error("WebSocket error", error);
            setIsConnected(false)
        }

        client.onDisconnect = () => {
            console.log("STOMP disconnected");
            setIsConnected(false)
        }

        client.activate()
        stompClientRef.current = client

        client.publish

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.deactivate()
            }
        }
    },[])

    const sendMessage = e => {
        e.preventDefault();
        if (messages.content.trim() === '' || messages.sender.trim() === '') {
            console.warn('Message content and sender cannot be empty.');
            return;
        }
        console.log('Sending message:', messages);
        
        stompClientRef.current.publish({
            destination: "/public/send",
            headers: {'content-type': 'application/json' },
            body: JSON.stringify(messages)
        })
        
        setMessages({
            sender: '',
            content: ''
        })
    }

    const sendlMessage = e => {
        e.preventDefault();
        if (lmessages.content.trim() === '' || lmessages.sender.trim() === '') {
            console.warn('Message content and sender cannot be empty.');
            return;
        }
        console.log('Sending message:', messages);
        
        stompClientRef.current.publish({
            destination: "/public/addtolist",
            headers: {'content-type': 'application/json' },
            body: JSON.stringify(lmessages)
        })
        
        setLMessages({
            sender: '',
            content: ''
        })
    }
  return (
    <>
      <div>
        <h2>Author</h2>
        <form onSubmit={sendMessage} style={{border: '1px solid black', padding: '10px'}}>
          <div>Simple message</div>
          <div>
            <label htmlFor="sender">Sender</label>
            <input type="text" id="sender" name="sender" value={messages.sender} onChange={e=>setMessages({...messages, sender: e.target.value})}/>
          </div>
          <div>
            <label htmlFor="content">content</label>
            <input type="text" id='content' name='content' value={messages.content} onChange={e=>setMessages({...messages, content: e.target.value})}/>
          </div>
          <div>
            <input type="submit" value="Send" />
          </div>
        </form>
        <form onSubmit={sendlMessage} style={{border: '1px solid black', padding: '10px', marginTop: '10px'}}>
          <div>List message message</div>
          <div>
            <label htmlFor="sender">Sender</label>
            <input type="text" id="sender" name="sender" value={lmessages.sender} onChange={e=>setLMessages({...lmessages, sender: e.target.value})}/>
          </div>
          <div>
            <label htmlFor="content">content</label>
            <input type="text" id='content' name='content' value={lmessages.content} onChange={e=>setLMessages({...lmessages, content: e.target.value})}/>
          </div>
          <div>
            <input type="submit" value="Send" />
          </div>
        </form>
      </div>
    </>
  )
}
