package com.example.websocket_be.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
@NoArgsConstructor@AllArgsConstructor@Builder
@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private ChatRoom chatRoom;

    @ManyToOne
    private User sender;
    private String content;

    @Column(updatable = false)
    @CreationTimestamp
    private Timestamp timestamp;
}
