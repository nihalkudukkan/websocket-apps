package com.example.websocket_be.repositories;

import com.example.websocket_be.model.ChatMessage;
import com.example.websocket_be.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    List<ChatMessage> findAllByChatRoom(ChatRoom chatRoom);
}
