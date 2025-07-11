package com.example.websocket_be.controllers;

import com.example.websocket_be.MessageService;
import com.example.websocket_be.model.Message;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@Slf4j
@AllArgsConstructor
public class WSController {

    private MessageService messageService;

    @MessageMapping("/send")
    @SendTo("/topic/receive")
    public Message simpleMessageAPI(Message message) {
        log.info("message received {}", message);
        return message;
    }

    @MessageMapping("/addtolist")
    @SendTo("/topic/list")
    public List<Message> listMessageApi(Message message) {
        log.info("message received to add to list {}", message);
        messageService.addToList(message);
        return messageService.getAllMessages();
    }

}
