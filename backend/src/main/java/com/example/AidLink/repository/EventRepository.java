package com.example.AidLink.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.models.Event;

@Repository
public interface EventRepository extends MongoRepository<Event, Integer> {
}
