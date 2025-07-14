package com.example.websocket_be.controllers;

import com.example.websocket_be.model.ChatMessage;
import com.example.websocket_be.model.request.SendChatMessageRequest;
import com.example.websocket_be.service.ChatMessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
@AllArgsConstructor
public class ChatMessageRestController {
    private ChatMessageService chatMessageService;

    @GetMapping("/chats/{user1}/{user2}")
    public List<ChatMessage> getChatGroupChat(@PathVariable String user1, @PathVariable String user2) {
        try {
            return chatMessageService
                    .findAllChatMessageOnChatRoom(user1,user2);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<?> sendChatMessage(@RequestBody SendChatMessageRequest messageRequest) {
        try {
            return new ResponseEntity<>(
                    chatMessageService
                    .sendChatMessage(messageRequest.getSender(), messageRequest.getReceiver(),messageRequest.getContent()),
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new Exception(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
