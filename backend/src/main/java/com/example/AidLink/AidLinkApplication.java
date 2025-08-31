package com.example.AidLink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
@org.springframework.web.bind.annotation.RestController
public class AidLinkApplication {

	public static void main(String[] args) {
		System.err.println("--> Start");
		SpringApplication.run(AidLinkApplication.class, args);
		System.err.println("--> End");
	}

	@GetMapping("/")
	public String apiRoot()
	{
		return "Welcome to the AidLink API";
	}

}
