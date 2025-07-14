package com.example.websocket_be.service;

import com.example.websocket_be.model.User;
import com.example.websocket_be.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserServices {

    private UserRepository userRepository;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User addUser(User userToSave) throws Exception {
        if (userRepository.findByUsername(userToSave.getUsername()).isPresent()) {
            throw new Exception("User " + userToSave.getUsername() + "already present");
        }
        return userRepository.save(userToSave);
    }

    public User findByUsername(String username) throws Exception {
        return userRepository.findByUsername(username)
                .orElseThrow(()->new Exception("User not found exception"));
    }

    public void saveAllUser(List<User> users) throws Exception {
        for (User user :
                users) {
            this.addUser(user);
        }
    }
}
