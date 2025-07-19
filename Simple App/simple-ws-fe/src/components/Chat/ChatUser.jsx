import axios from 'axios';
import React, { use, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import ChatBox from './ChatBox';
import { webSocketBe } from '../../configuration/WSConfig';

export default function ChatUser() {
    const stompClientRef = useRef(null);
    const { username } = useParams();
    const [users, setUsers] = useState([]);
    const [chatBoxEnabled, setChatBoxEnabled] = useState(false);
    const [chatBoxReceiver, setChatBoxReceiver] = useState(null);

    useEffect(() => {
        console.log('ChatUser component mounted for user:', username);
        // You can add logic here to fetch user-specific data or set up subscriptions
        axios.get("http://localhost:8080/users")
            .then((response) => {
                let availableUsers = response.data.filter(user => user.username !== username);
                setUsers(availableUsers);
            }).catch((error) => {
                console.error("Error fetching users:", error);
            });

            const client = webSocketBe();
            client.onConnect = () => {
                console.log("WebSocket connected");
                client.subscribe(`/topic/usersAvailable`, (message) => {
                    const chatMessage = JSON.parse(message.body);
                    console.log("New message received:", chatMessage);
                    // Logic to handle incoming messages can be added here
                    let availableUsers = chatMessage.filter(user => user.username !== username);
                    setUsers(availableUsers);
                });
            }
            client.onStompError = (error) => {
            console.error("STOMP connection error", error);
        }

        client.onWebSocketError = (error) => {
            console.error("WebSocket error", error);
        }

        client.onDisconnect = () => {
            console.log("STOMP disconnected");
        }

        client.activate()
        stompClientRef.current=client

        return () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                stompClientRef.current.deactivate()
            }
        }

    }, [username]);

    const enableChatBox = (name) => {
        // Logic to enable the chat box can be added here
        console.log("Chat box enabled for user:", name);
        setChatBoxReceiver(name);
        setChatBoxEnabled(true);
    }

    return (
        <div className='mx-auto w-sm md:w-md lg:w-lg p-2 border-2 border-black rounded-md'>
            <h2>ChatUser</h2>
            <div>
                <h3>Users available to chat</h3>
                {
                    users.map((user, index) => (
                        <div key={index} className='m-3'>
                            <button className='bg-green-700 p-2 rounded-sm text-white cursor-pointer' onClick={()=>enableChatBox(user.username)}>{user.username}</button>
                        </div>
                    ))
                }
            </div>
            <div>
                {chatBoxEnabled && <ChatBox sender={username} receiver={chatBoxReceiver} stompClientRef={stompClientRef}/>}
                {/* The ChatBox component will be rendered here when chatBoxEnabled is true */}
            </div>
        </div>
    )
}
