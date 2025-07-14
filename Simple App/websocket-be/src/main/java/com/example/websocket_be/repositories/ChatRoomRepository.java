package com.example.websocket_be.repositories;

import com.example.websocket_be.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    Optional<ChatRoom> findByCreatorUsername(String username);
    Optional<ChatRoom> findByCreatorUsernameAndJoinerUsername(String username1, String username2);
}
