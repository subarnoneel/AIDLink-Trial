package com.example.AidLink.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.models.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findByUsername(String username);
}
