package com.example.AidLink.controller;

import com.example.AidLink.service.EventService;
import com.example.models.Event;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/events")
public class EventAdminController {
    private final EventService eventService;

    public EventAdminController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<Event> addEvent(@RequestBody Event event) {
        Event savedEvent = eventService.addEvent(event);
        return ResponseEntity.ok(savedEvent);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Integer id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{id}/donate")
    public ResponseEntity<Event> donateToEvent(@PathVariable Integer id, @RequestBody Map<String, Object> donationData) {
        System.out.println("Received donation request for event ID: " + id);
        Integer amount = null;
        String userEmail = null;
        try {
            amount = (donationData.get("amount") instanceof Integer) ? (Integer) donationData.get("amount") : Integer.parseInt(donationData.get("amount").toString());
            userEmail = donationData.get("userEmail") != null ? donationData.get("userEmail").toString() : null;
        } catch (Exception ex) {
            System.out.println("Error parsing donation data: " + ex.getMessage());
            return ResponseEntity.badRequest().build();
        }
        System.out.println("Donation amount: " + amount);
        System.out.println("User email: " + userEmail);
        if (amount == null || amount <= 0) {
            System.out.println("Invalid donation amount: " + amount);
            return ResponseEntity.badRequest().build();
        }
        if (userEmail == null || userEmail.isEmpty()) {
            System.out.println("User email missing in donation request");
            return ResponseEntity.badRequest().build();
        }
        try {
            Event updatedEvent = eventService.updateEventFundingAndUserDonation(id, amount, userEmail);
            if (updatedEvent != null) {
                System.out.println("Successfully updated event funding. New funding: " + updatedEvent.getCurrentFunding());
                return ResponseEntity.ok(updatedEvent);
            } else {
                System.out.println("Event not found with ID: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("Error updating event funding or user donation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
}   