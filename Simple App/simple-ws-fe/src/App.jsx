import { useEffect, useRef, useState } from 'react';
import './App.css'
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function App() {
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({
    sender: '',
    content: ''
  });

  useEffect(() => {
    const socketUrl = 'http://localhost:8080/ws'; // Matches your Spring Boot endpoint "/ws"

    const client = new Client({

      webSocketFactory: () => new SockJS(socketUrl),
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,

      debug: (str) => {
        console.log("STOMP Debug:", str);
      },

      reconnectDelay: 5000, // Try to reconnect every 5 seconds
    });

    client.onConnect = (frame) => {
      console.log('Connected to STOMP:', frame);
      setIsConnected(true);

      // Subscribe to the public topic for receiving messages
      // This matches your Spring Boot `enableSimpleBroker("/topic")`
      // client.subscribe('/topic/messages', (message) => { // Example: subscribe to /topic/messages
      //   console.log('Received message:', message.body);
      //   setMessages((prevMessages) => [...prevMessages, message.body]);
      // });

      // You can also send a "join" message upon connection if your backend expects it
      // client.publish({ destination: '/public/chat.addUser', body: JSON.stringify({ username: 'ReactUser', type: 'JOIN' }) });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
      setIsConnected(false);
    };

    client.onWebSocketError = (error) => {
        console.error('WebSocket Error:', error);
        setIsConnected(false);
    };

    client.onDisconnect = () => {
      console.log('Disconnected from STOMP');
      setIsConnected(false);
    };

    // Activate the client to establish the connection
    client.activate();
    stompClientRef.current = client; // Store the client instance in a ref

    // Cleanup function when the component unmounts
    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        console.log('Deactivating STOMP client on unmount...');
        stompClientRef.current.deactivate();
      }
    };
  }, [])

  const sendMessage = (e) => {
    e.preventDefault();
    if (stompClientRef.current && stompClientRef.current.connected && messages.content) {
      // Send message to the Spring Boot application's destination prefix
      // This matches your Spring Boot `setApplicationDestinationPrefixes("/public")`
      const messagePayload = {
        sender: messages.sender.trim(),
        content: messages.content.trim(),
      };

      stompClientRef.current.publish({
        destination: '/public/send', // Example: /public/chat.sendMessage
        body: JSON.stringify(messagePayload),
        headers: {
          'content-type': 'application/json' // Important for JSON payloads
        }
      });
      setMessages({
        sender: '',
        content: ''
      });
    } else if (!isConnected) {
        console.warn('Not connected to WebSocket. Message not sent.');
    }
  };

  return (
    <>
      <div>
        <form onSubmit={sendMessage}>
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
      </div>
    </>
  )
}

export default App
