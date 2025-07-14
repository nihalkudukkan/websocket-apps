package com.example.websocket_be.service;

import com.example.websocket_be.model.ChatMessage;
import com.example.websocket_be.model.ChatRoom;
import com.example.websocket_be.model.User;
import com.example.websocket_be.repositories.ChatMessageRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ChatMessageService {

    private ChatMessageRepository chatMessageRepository;
    private ChatRoomService chatRoomService;
    private UserServices userServices;

    public List<ChatMessage> findAllChatMessageOnChatRoom(String sender, String receiver) throws Exception {
        ChatRoom chatRoom = chatRoomService.findChatRoom(sender, receiver);

        return chatMessageRepository.findAllByChatRoom(chatRoom);
    }

    public ChatMessage sendChatMessage(String senderUsername, String receiverUsername, String content) throws Exception {
        ChatRoom chatRoom = chatRoomService.findChatRoom(senderUsername, receiverUsername);

        User sender = userServices.findByUsername(senderUsername);

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .chatRoom(chatRoom)
                .content(content)
                .build();

        return chatMessageRepository.save(message);
    }

}
