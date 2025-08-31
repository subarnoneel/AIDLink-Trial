package com.example.AidLink.service;

import com.example.AidLink.repository.EventRepository;
import com.example.AidLink.repository.UserRepository;
import com.example.models.User;
import com.example.models.Event;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
	private final EventRepository eventRepository;
	private final UserRepository userRepository;

	public EventService(EventRepository eventRepository, UserRepository userRepository) {
		this.eventRepository = eventRepository;
		this.userRepository = userRepository;
	}
	// Update both event funding and user's donatedAmount
	public Event updateEventFundingAndUserDonation(Integer eventId, int donationAmount, String userEmail) {
		System.out.println("EventService: Updating event funding for event ID: " + eventId + " with amount: " + donationAmount);
		Optional<Event> eventOptional = eventRepository.findById(eventId);
		if (eventOptional.isPresent()) {
			Event event = eventOptional.get();
			int newCurrentFunding = event.getCurrentFunding() + donationAmount;
			event.setCurrentFunding(newCurrentFunding);
			eventRepository.save(event);

			// Update user's donatedAmount
			User user = userRepository.findByEmail(userEmail);
			if (user != null) {
				int newDonatedAmount = user.getDonatedAmount() + donationAmount;
				user.setDonatedAmount(newDonatedAmount);
				userRepository.save(user);
				System.out.println("User " + userEmail + " donated. New donatedAmount: " + newDonatedAmount);
			} else {
				System.out.println("User not found with email: " + userEmail);
			}
			return event;
		} else {
			System.out.println("EventService: Event not found with ID: " + eventId);
		}
		return null;
	}

	public Event addEvent(Event event) {
		// If id is null, generate a new unique integer id
		if (event.getId() == null) {
			List<Event> allEvents = eventRepository.findAll();
			int maxId = allEvents.stream()
				.map(e -> e.getId() == null ? 0 : e.getId())
				.max(Integer::compareTo)
				.orElse(0);
			event.setId(maxId + 1);
		}
		return eventRepository.save(event);
	}

	public List<Event> getAllEvents() {
		return eventRepository.findAll();
	}

	public Optional<Event> getEventById(Integer id) {
		return eventRepository.findById(id);
	}
	
	public Event updateEventFunding(Integer eventId, int donationAmount) {
		System.out.println("EventService: Updating event funding for event ID: " + eventId + " with amount: " + donationAmount);
		
		Optional<Event> eventOptional = eventRepository.findById(eventId);
		if (eventOptional.isPresent()) {
			Event event = eventOptional.get();
			System.out.println("EventService: Found event: " + event.getId() + " - " + event.getTitle());
			System.out.println("EventService: Current funding: " + event.getCurrentFunding() + ", Funding goal: " + event.getFundingGoal());
			
			// Add the donation amount to the current funding
			int newCurrentFunding = event.getCurrentFunding() + donationAmount;
			event.setCurrentFunding(newCurrentFunding);
			
			System.out.println("EventService: New funding amount: " + newCurrentFunding);
			return eventRepository.save(event);
		} else {
			System.out.println("EventService: Event not found with ID: " + eventId);
		}
		return null;
	}
}
