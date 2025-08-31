package com.example.AidLink.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.models.Organization;

@Repository
public interface OrganizationRepository extends MongoRepository<Organization, String> {
    // Find organizations by approval status (nested field)
    List<Organization> findByRegistrationStatus_ApprovalStatus(String approvalStatus);

    // Find organizations by approval status and eventId in eventRegistrations
    List<Organization> findByRegistrationStatus_ApprovalStatusAndEventRegistrations_EventId(String approvalStatus, Integer eventId);
    
    // Note: findById(String id) is inherited from MongoRepository
    // This method is used by the getOrganizationById endpoint in OrganizationAdminController
}
