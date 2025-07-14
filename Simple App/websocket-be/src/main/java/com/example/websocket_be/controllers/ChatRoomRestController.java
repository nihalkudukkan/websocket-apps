package com.example.websocket_be.controllers;

import com.example.websocket_be.model.ChatRoom;
import com.example.websocket_be.model.ErrorResponse;
import com.example.websocket_be.model.User;
import com.example.websocket_be.service.ChatRoomService;
import com.example.websocket_be.service.UserServices;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin("http://localhost:5173")
public class ChatRoomRestController {
    private ChatRoomService chatRoomService;
    private UserServices userServices;

    @GetMapping("/chatrooms")
    public List<ChatRoom> findAllChatRoom() {
        return chatRoomService.findAllChatRoom();
    }

    @PostMapping("/chatroom/{user1}/{user2}")
    public ResponseEntity<?> createChatRoom(@PathVariable String user1, @PathVariable String user2) {
        if (user1.equalsIgnoreCase(user2)) {
            return new ResponseEntity<>(new ErrorResponse("Both parties cannot be the same"), HttpStatus.BAD_REQUEST);
        }
        try {
            ChatRoom chatRoom = ChatRoom.builder()
                    .creator(User.builder().username(user1).build())
                    .joiner(User.builder().username(user2).build())
                    .build();
            ChatRoom saved = chatRoomService.createChatRoom(chatRoom);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/chatroom/{user1}/{user2}")
    public ResponseEntity<?> findChatRoom(@PathVariable String user1, @PathVariable String user2) {
        try {
            return new ResponseEntity<>(chatRoomService.findChatRoom(user1,user2), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ErrorResponse(e.getMessage()), HttpStatus.NOT_FOUND);
        }
    }
}
