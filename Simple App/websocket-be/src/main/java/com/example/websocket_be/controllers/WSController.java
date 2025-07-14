package com.example.websocket_be.controllers;

import com.example.websocket_be.model.ChatMessage;
import com.example.websocket_be.model.Message;
import com.example.websocket_be.model.User;
import com.example.websocket_be.model.request.SendChatMessageRequest;
import com.example.websocket_be.service.ChatMessageService;
import com.example.websocket_be.service.MessageService;
import com.example.websocket_be.service.UserServices;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@Slf4j
@AllArgsConstructor
public class WSController {

    private MessageService messageService;
    private UserServices userServices;
    private ChatMessageService chatMessageService;
    private SimpMessagingTemplate simpMessagingTemplate;

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

    @MessageMapping("/addUser")
    @SendTo("/topic/usersAvailable")
    public List<User> availableUsers(User user) {
        try {
            userServices.addUser(user);
            log.info("User {} saved", user.getUsername());
            return userServices.findAllUsers();
        } catch (Exception e) {
            log.error(e.getMessage());
            return userServices.findAllUsers();
        }
    }

    @MessageMapping("/sentChat")
    public void sendChatMessage(SendChatMessageRequest chat) {
        try {
            log.info("Sending chat for {}", chat.getSender());
            chatMessageService.sendChatMessage(chat.getSender(), chat.getReceiver(), chat.getContent());
            List<ChatMessage> chats = chatMessageService
                    .findAllChatMessageOnChatRoom(chat.getSender(), chat.getReceiver());
            String chatRoomId = String.valueOf(chats.get(0).getChatRoom().getId());
            log.info("Chat room id: {}", chatRoomId);
            log.info("sending message to {}{}{}", "/event/", chatRoomId,"/queue/chat");
            simpMessagingTemplate
                    .convertAndSendToUser(chatRoomId,
                            "/queue/chat",
                            chats);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

}
