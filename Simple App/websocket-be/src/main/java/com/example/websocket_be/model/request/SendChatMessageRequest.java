package com.example.websocket_be.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data@NoArgsConstructor@AllArgsConstructor
public class SendChatMessageRequest {
    private String sender;
    private String receiver;
    private String content;
}
