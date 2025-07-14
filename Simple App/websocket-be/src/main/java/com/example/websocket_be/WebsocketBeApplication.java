package com.example.websocket_be;

import com.example.websocket_be.model.User;
import com.example.websocket_be.service.UserServices;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;

@SpringBootApplication
public class WebsocketBeApplication {

	@Autowired
	public UserServices userServices;

	public static void main(String[] args) {
		SpringApplication.run(WebsocketBeApplication.class, args);
	}

	@PostConstruct
	public void createRows() throws Exception {
		List<User> users = List.of(User.builder().username("nihal").build(),
				User.builder().username("sam").build(),
				User.builder().username("dave").build());

		userServices.saveAllUser(users);
	}

}
