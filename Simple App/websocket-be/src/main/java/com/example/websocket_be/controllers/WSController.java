package com.example.websocket_be.controllers;

import com.example.websocket_be.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WSController {

    @MessageMapping("/send")
    @SendTo("/topic/receive")
    public Message communicate(Message message) {
        return message;
    }
}
