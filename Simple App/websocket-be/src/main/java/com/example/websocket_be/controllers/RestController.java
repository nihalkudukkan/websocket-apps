package com.example.websocket_be.controllers;

import com.example.websocket_be.service.MessageService;
import com.example.websocket_be.model.Message;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@org.springframework.web.bind.annotation.RestController
@CrossOrigin("http://localhost:5173")
@AllArgsConstructor
public class RestController {

    private MessageService messageService;

    @GetMapping("/list")
    public List<Message> allMessages() {
        return messageService.getAllMessages();
    }
}
