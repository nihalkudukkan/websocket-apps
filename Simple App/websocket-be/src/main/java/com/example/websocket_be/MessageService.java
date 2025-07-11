package com.example.websocket_be;

import com.example.websocket_be.model.Message;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {

    List<Message> messages = new ArrayList<>();

    public void addToList(Message message) {
        messages.add(message);
    }

    public List<Message> getAllMessages() {
        return messages;
    }
}
