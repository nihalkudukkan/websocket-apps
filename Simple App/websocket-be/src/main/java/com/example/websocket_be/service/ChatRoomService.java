package com.example.websocket_be.service;

import com.example.websocket_be.model.ChatRoom;
import com.example.websocket_be.repositories.ChatRoomRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ChatRoomService {
    private ChatRoomRepository chatRoomRepository;
    private UserServices userServices;

    public List<ChatRoom> findAllChatRoom() {
        return chatRoomRepository.findAll();
    }

    public ChatRoom createChatRoom(ChatRoom chatRoom) throws Exception {
        if (chatRoomRepository
                .findByCreatorUsernameAndJoinerUsername(chatRoom.getCreator().getUsername(),
                        chatRoom.getJoiner().getUsername()).isPresent() ||
        chatRoomRepository
                .findByCreatorUsernameAndJoinerUsername(chatRoom.getJoiner().getUsername(),
                        chatRoom.getCreator().getUsername()).isPresent()
        ) {
            throw new Exception("Chat room already present");
        }
        try {
            chatRoom.setCreator(userServices.findByUsername(chatRoom.getCreator().getUsername()));
        } catch (Exception e) {
            throw new Exception("Creator not found");
        }
        try {
            chatRoom.setJoiner(userServices.findByUsername(chatRoom.getJoiner().getUsername()));
        } catch (Exception e) {
            throw new Exception("Joiner not found");
        }
        return chatRoomRepository.saveAndFlush(chatRoom);
    }

    public ChatRoom findChatRoom(String user1, String user2) throws Exception {
        return chatRoomRepository.findByCreatorUsernameAndJoinerUsername(user1,user2)
                .or(()->chatRoomRepository.findByCreatorUsernameAndJoinerUsername(user2,user1))
                .orElseThrow(()->new Exception("Chat room not found"));
    }
}
