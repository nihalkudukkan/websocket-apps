import axios from 'axios';
import React, { use, useEffect } from 'react'

export default function ({sender, receiver, stompClientRef}) {
    const [chats, setChats] = React.useState([]);
    const [isChatroomEnabled, setIsChatroomEnabled] = React.useState(false);
    const [chatRoom, setChatRoom] = React.useState(null);
    const [content, setContent] = React.useState("");

    const handleChatSubmit = (e) => {
        e.preventDefault();

        let chatRequest = {
            sender: sender,
            receiver: receiver,
            content: content
        }

        console.log("Chat request object:", chatRequest);

        stompClientRef.current.publish({
            destination: `/public/sentChat`,
            headers: {'content-type': 'application/json' },
            body: JSON.stringify(chatRequest)
        });
        setContent(""); 
    }

    useEffect(() => {
        console.log('ChatBox component mounted');
        axios.get(`http://localhost:8080/chatroom/${sender}/${receiver}`)
            .then(res=>{
                setIsChatroomEnabled(true)
                setChatRoom(res.data);}
            ).catch(err=>{
                console.error("Error fetching chatroom:", err.response.data.error);
                setIsChatroomEnabled(false);
                setChatRoom(null);
            });
    }, [receiver, sender]);

    const handleCreateChatRoom = () => {
        console.log("Creating chat room for:", sender, receiver);
        axios.post(`http://localhost:8080/chatroom/${sender}/${receiver}`)
            .then(res => {
                setIsChatroomEnabled(true);
                setChatRoom(res.data);
                console.log("Chat room created successfully:", res.data);
            }).catch(err => {
                console.error("Error creating chat room:", err.response.data.error);
            });
    }

    useEffect(() => {
        if (isChatroomEnabled) {
            axios.get(`http://localhost:8080/chats/${sender}/${receiver}`)
                .then(res => {
                    console.log("Fetched chat messages:", res.data);
                    setChats(res.data);
                }).catch(err => {
                    console.error("Error fetching chat messages:", err.response.data.error);
                });

            console.log("Subscribing to chat messages for chat room:", chatRoom.id);
            
            stompClientRef.current.subscribe(`/topic/${chatRoom.id}/queue/chat`, (message) => {
                const chatMessage = JSON.parse(message.body);
                console.log("New chat message received:", chatMessage);
                setChats(prevChats => chatMessage);
            })
        }
    }, [isChatroomEnabled, chatRoom]);

  return (
    <div>
        <h4>Chat box</h4>
        <p>Receiver: {receiver}</p>
        <div>
            {chats.map((item, index) => (
                <div key={index}>
                    <p>{item.sender.username}: {item.content}</p>
                </div>
            ))}
        </div>
        {
            chats.length === 0 && <p>No messages yet.</p>
        }
        {
            isChatroomEnabled ? (
                <form onSubmit={handleChatSubmit}>
                    <input type="text" name="content" id="content" value={content} onChange={e=>setContent(e.target.value)} />
                    <input type="submit" value="Send" />
                </form>) :
                <button onClick={() => handleCreateChatRoom()}>Start Chat</button>
        }
    </div>
  )
}
