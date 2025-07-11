package com.example.websocket_be.controllers;

import com.example.websocket_be.model.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class WSController {

    @MessageMapping("/send")
    @SendTo("/topic/receive")
    public Message communicate(Message message) {
        log.info("message received {}", message);
        return message;
    }
}
