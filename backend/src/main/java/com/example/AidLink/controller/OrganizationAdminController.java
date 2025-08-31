package com.example.AidLink.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.AidLink.repository.OrganizationRepository;
import com.example.models.Organization;

@RestController
@RequestMapping("/api/admin")
// Duplicate class definition removed


public class OrganizationAdminController {
    private final OrganizationRepository organizationRepository;

    public OrganizationAdminController(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    // Register a new organization with pending approval status
    @PostMapping("/register-organization")
    public ResponseEntity<Organization> registerOrganization(@RequestBody Organization org) {
        if (org.getId() == null || org.getId().isEmpty()) {
            return ResponseEntity.badRequest().body(null); // Require custom string ID
        }
        if (org.getRegistrationStatus() == null) org.setRegistrationStatus(new Organization.RegistrationStatus());
        org.getRegistrationStatus().setApprovalStatus("pending");
        Organization saved = organizationRepository.save(org);
        return ResponseEntity.ok(saved);
    }
    // Get organizations with pending approval status
    @GetMapping("/pending-organizations")
    public List<Organization> getPendingOrganizations() {
        return organizationRepository.findByRegistrationStatus_ApprovalStatus("pending");
    }

    // Approve organization (set approvalStatus to "approved")
    @PostMapping("/approve-organization/{id}")
    public ResponseEntity<Organization> approveOrganization(@PathVariable String id) {
        Organization org = organizationRepository.findById(id).orElse(null);
        if (org == null) return ResponseEntity.notFound().build();
        if (org.getRegistrationStatus() == null) org.setRegistrationStatus(new Organization.RegistrationStatus());
        org.getRegistrationStatus().setApprovalStatus("approved");
        organizationRepository.save(org);
        return ResponseEntity.ok(org);
    }

    // Reject and delete organization from database
    @PostMapping("/reject-organization/{id}")
    public ResponseEntity<String> rejectOrganization(@PathVariable String id) {
        Organization org = organizationRepository.findById(id).orElse(null);
        if (org == null) return ResponseEntity.notFound().build();
        
        // Delete the organization from database
        organizationRepository.deleteById(id);
        return ResponseEntity.ok("Organization rejected and deleted successfully");
    }

    // Register organization for an event (add EventRegistration)
    @PostMapping("/organizations/{orgId}/register-event/{eventId}")
    public ResponseEntity<Organization> registerOrgForEvent(@PathVariable String orgId, @PathVariable String eventId) {
        Organization org = organizationRepository.findById(orgId).orElse(null);
        if (org == null) return ResponseEntity.notFound().build();
        if (org.getEventRegistrations() == null) org.setEventRegistrations(new ArrayList<>());
        Organization.EventRegistration registration = new Organization.EventRegistration();
        // Ensure eventId is stored as Integer
        try {
            registration.setEventId(Integer.valueOf(eventId));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(null);
        }
        registration.setStatus("registered");
        org.getEventRegistrations().add(registration);
        organizationRepository.save(org);
        return ResponseEntity.ok(org);
    }
    // Get organizations approved and registered for a specific event
    @GetMapping("/organizations/approved-for-event/{eventId}")
    public List<Organization> getApprovedOrgsForEvent(@PathVariable Integer eventId) {
        return organizationRepository.findByRegistrationStatus_ApprovalStatusAndEventRegistrations_EventId("approved", eventId);
    }
    
    // Get organization details by ID
    @GetMapping("/organizations/{id}")
    public ResponseEntity<Organization> getOrganizationById(@PathVariable String id) {
        return organizationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}