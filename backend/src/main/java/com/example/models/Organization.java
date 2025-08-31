package com.example.models;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "organizations")
public class Organization {
    @Id
    private String id;
    private OrganizationInfo organizationInfo;
    private AddressInfo addressInfo;
    private LegalDocumentation legalDocumentation;
    private OrganizationDetails organizationDetails;
    private FinancialInformation financialInformation;
    private Leadership leadership;
    private List<Program> programs;
    private List<ContactPerson> contactPersons;
    private List<EventRegistration> eventRegistrations;
    private RegistrationStatus registrationStatus;

        // --- Nested Classes ---
        public static class OrganizationInfo {
            private String legalName;
            private String commonName;
            private String acronym;
            private String organizationType;
            private String registrationNumber;
            private String taxId;
            private String establishedDate;
            private String website;
            private String email;
            private String phone;
            private String password;
            private String logo;
            // Getters and setters
            public String getLegalName() { return legalName; }
            public void setLegalName(String legalName) { this.legalName = legalName; }
            public String getCommonName() { return commonName; }
            public void setCommonName(String commonName) { this.commonName = commonName; }
            public String getAcronym() { return acronym; }
            public void setAcronym(String acronym) { this.acronym = acronym; }
            public String getOrganizationType() { return organizationType; }
            public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }
            public String getRegistrationNumber() { return registrationNumber; }
            public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
            public String getTaxId() { return taxId; }
            public void setTaxId(String taxId) { this.taxId = taxId; }
            public String getEstablishedDate() { return establishedDate; }
            public void setEstablishedDate(String establishedDate) { this.establishedDate = establishedDate; }
            public String getWebsite() { return website; }
            public void setWebsite(String website) { this.website = website; }
            public String getEmail() { return email; }
            public void setEmail(String email) { this.email = email; }
            public String getPhone() { return phone; }
            public void setPhone(String phone) { this.phone = phone; }
            public String getPassword() { return password; }
            public void setPassword(String password) { this.password = password; }
            public String getLogo() { return logo; }
            public void setLogo(String logo) { this.logo = logo; }
        }

        public static class AddressInfo {
            private Headquarters headquarters;
            private List<OperationalRegion> operationalRegions;
            private List<FieldOffice> fieldOffices;
            // Getters and setters
            public Headquarters getHeadquarters() { return headquarters; }
            public void setHeadquarters(Headquarters headquarters) { this.headquarters = headquarters; }
            public List<OperationalRegion> getOperationalRegions() { return operationalRegions; }
            public void setOperationalRegions(List<OperationalRegion> operationalRegions) { this.operationalRegions = operationalRegions; }
            public List<FieldOffice> getFieldOffices() { return fieldOffices; }
            public void setFieldOffices(List<FieldOffice> fieldOffices) { this.fieldOffices = fieldOffices; }
            public static class Headquarters {
                private String street;
                private String city;
                private String state;
                private String zipCode;
                private String country;
                // Getters and setters
                public String getStreet() { return street; }
                public void setStreet(String street) { this.street = street; }
                public String getCity() { return city; }
                public void setCity(String city) { this.city = city; }
                public String getState() { return state; }
                public void setState(String state) { this.state = state; }
                public String getZipCode() { return zipCode; }
                public void setZipCode(String zipCode) { this.zipCode = zipCode; }
                public String getCountry() { return country; }
                public void setCountry(String country) { this.country = country; }
            }
            public static class OperationalRegion {
                private String region;
                private List<String> countries;
                private boolean isActive;
                // Getters and setters
                public String getRegion() { return region; }
                public void setRegion(String region) { this.region = region; }
                public List<String> getCountries() { return countries; }
                public void setCountries(List<String> countries) { this.countries = countries; }
                public boolean isActive() { return isActive; }
                public void setActive(boolean active) { isActive = active; }
            }
            public static class FieldOffice {
                private String name;
                private String address;
                private String phone;
                private String email;
                // Getters and setters
                public String getName() { return name; }
                public void setName(String name) { this.name = name; }
                public String getAddress() { return address; }
                public void setAddress(String address) { this.address = address; }
                public String getPhone() { return phone; }
                public void setPhone(String phone) { this.phone = phone; }
                public String getEmail() { return email; }
                public void setEmail(String email) { this.email = email; }
            }
        }

        public static class LegalDocumentation {
            private Certificate incorporationCertificate;
            private Certificate taxExemptStatus;
            private Certificate operatingLicense;
            private List<AuditReport> auditReports;
            // Getters and setters
            public Certificate getIncorporationCertificate() { return incorporationCertificate; }
            public void setIncorporationCertificate(Certificate incorporationCertificate) { this.incorporationCertificate = incorporationCertificate; }
            public Certificate getTaxExemptStatus() { return taxExemptStatus; }
            public void setTaxExemptStatus(Certificate taxExemptStatus) { this.taxExemptStatus = taxExemptStatus; }
            public Certificate getOperatingLicense() { return operatingLicense; }
            public void setOperatingLicense(Certificate operatingLicense) { this.operatingLicense = operatingLicense; }
            public List<AuditReport> getAuditReports() { return auditReports; }
            public void setAuditReports(List<AuditReport> auditReports) { this.auditReports = auditReports; }
            public static class Certificate {
                private String documentNumber;
                private String issueDate;
                private String expiryDate;
                private String issuingAuthority;
                private String status;
                private String imageUrl;
                // Getters and setters
                public String getDocumentNumber() { return documentNumber; }
                public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }
                public String getIssueDate() { return issueDate; }
                public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
                public String getExpiryDate() { return expiryDate; }
                public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
                public String getIssuingAuthority() { return issuingAuthority; }
                public void setIssuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; }
                public String getStatus() { return status; }
                public void setStatus(String status) { this.status = status; }
                public String getImageUrl() { return imageUrl; }
                public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
            }
            public static class AuditReport {
                private int year;
                private String auditorName;
                private String auditDate;
                private String reportUrl;
                private boolean isVerified;
                private boolean cleanOpinion;
                // Getters and setters
                public int getYear() { return year; }
                public void setYear(int year) { this.year = year; }
                public String getAuditorName() { return auditorName; }
                public void setAuditorName(String auditorName) { this.auditorName = auditorName; }
                public String getAuditDate() { return auditDate; }
                public void setAuditDate(String auditDate) { this.auditDate = auditDate; }
                public String getReportUrl() { return reportUrl; }
                public void setReportUrl(String reportUrl) { this.reportUrl = reportUrl; }
                public boolean isVerified() { return isVerified; }
                public void setVerified(boolean verified) { isVerified = verified; }
                public boolean isCleanOpinion() { return cleanOpinion; }
                public void setCleanOpinion(boolean cleanOpinion) { this.cleanOpinion = cleanOpinion; }
            }
        }

        public static class OrganizationDetails {
            private String mission;
            private String vision;
            private List<String> focusAreas;
            private List<String> targetBeneficiaries;
            private OperationalCapacity operationalCapacity;
            // Getters and setters
            public String getMission() { return mission; }
            public void setMission(String mission) { this.mission = mission; }
            public String getVision() { return vision; }
            public void setVision(String vision) { this.vision = vision; }
            public List<String> getFocusAreas() { return focusAreas; }
            public void setFocusAreas(List<String> focusAreas) { this.focusAreas = focusAreas; }
            public List<String> getTargetBeneficiaries() { return targetBeneficiaries; }
            public void setTargetBeneficiaries(List<String> targetBeneficiaries) { this.targetBeneficiaries = targetBeneficiaries; }
            public OperationalCapacity getOperationalCapacity() { return operationalCapacity; }
            public void setOperationalCapacity(OperationalCapacity operationalCapacity) { this.operationalCapacity = operationalCapacity; }
            public static class OperationalCapacity {
                private int staffCount;
                private int volunteersCount;
                private int emergencyResponseTeams;
                private String logisticalCapacity;
                private String mobilizationTime;
                // Getters and setters
                public int getStaffCount() { return staffCount; }
                public void setStaffCount(int staffCount) { this.staffCount = staffCount; }
                public int getVolunteersCount() { return volunteersCount; }
                public void setVolunteersCount(int volunteersCount) { this.volunteersCount = volunteersCount; }
                public int getEmergencyResponseTeams() { return emergencyResponseTeams; }
                public void setEmergencyResponseTeams(int emergencyResponseTeams) { this.emergencyResponseTeams = emergencyResponseTeams; }
                public String getLogisticalCapacity() { return logisticalCapacity; }
                public void setLogisticalCapacity(String logisticalCapacity) { this.logisticalCapacity = logisticalCapacity; }
                public String getMobilizationTime() { return mobilizationTime; }
                public void setMobilizationTime(String mobilizationTime) { this.mobilizationTime = mobilizationTime; }
            }
        }

        public static class FinancialInformation {
            private AnnualBudget annualBudget;
            private List<FundingSource> fundingSources;
            // Getters and setters
            public AnnualBudget getAnnualBudget() { return annualBudget; }
            public void setAnnualBudget(AnnualBudget annualBudget) { this.annualBudget = annualBudget; }
            public List<FundingSource> getFundingSources() { return fundingSources; }
            public void setFundingSources(List<FundingSource> fundingSources) { this.fundingSources = fundingSources; }
            public static class AnnualBudget {
                private int year;
                private double totalBudget;
                private double programExpenses;
                private double administrativeExpenses;
                private double fundraisingExpenses;
                private double programEfficiencyRatio;
                // Getters and setters
                public int getYear() { return year; }
                public void setYear(int year) { this.year = year; }
                public double getTotalBudget() { return totalBudget; }
                public void setTotalBudget(double totalBudget) { this.totalBudget = totalBudget; }
                public double getProgramExpenses() { return programExpenses; }
                public void setProgramExpenses(double programExpenses) { this.programExpenses = programExpenses; }
                public double getAdministrativeExpenses() { return administrativeExpenses; }
                public void setAdministrativeExpenses(double administrativeExpenses) { this.administrativeExpenses = administrativeExpenses; }
                public double getFundraisingExpenses() { return fundraisingExpenses; }
                public void setFundraisingExpenses(double fundraisingExpenses) { this.fundraisingExpenses = fundraisingExpenses; }
                public double getProgramEfficiencyRatio() { return programEfficiencyRatio; }
                public void setProgramEfficiencyRatio(double programEfficiencyRatio) { this.programEfficiencyRatio = programEfficiencyRatio; }
            }
            public static class FundingSource {
                private String source;
                private int percentage;
                private double amount;
                // Getters and setters
                public String getSource() { return source; }
                public void setSource(String source) { this.source = source; }
                public int getPercentage() { return percentage; }
                public void setPercentage(int percentage) { this.percentage = percentage; }
                public double getAmount() { return amount; }
                public void setAmount(double amount) { this.amount = amount; }
            }
        }

        public static class Leadership {
            private ExecutiveDirector executiveDirector;
            // Getters and setters
            public ExecutiveDirector getExecutiveDirector() { return executiveDirector; }
            public void setExecutiveDirector(ExecutiveDirector executiveDirector) { this.executiveDirector = executiveDirector; }
            public static class ExecutiveDirector {
                private String name;
                private String position;
                private String email;
                private String phone;
                private String bio;
                private String linkedIn;
                private String photo;
                // Getters and setters
                public String getName() { return name; }
                public void setName(String name) { this.name = name; }
                public String getPosition() { return position; }
                public void setPosition(String position) { this.position = position; }
                public String getEmail() { return email; }
                public void setEmail(String email) { this.email = email; }
                public String getPhone() { return phone; }
                public void setPhone(String phone) { this.phone = phone; }
                public String getBio() { return bio; }
                public void setBio(String bio) { this.bio = bio; }
                public String getLinkedIn() { return linkedIn; }
                public void setLinkedIn(String linkedIn) { this.linkedIn = linkedIn; }
                public String getPhoto() { return photo; }
                public void setPhoto(String photo) { this.photo = photo; }
            }
        }

        public static class Program {
            private String programId;
            private String name;
            private String description;
            private String category;
            private double budget;
            private int beneficiariesReached;
            private String status;
            private String startDate;
            private String endDate;
            private String coverImage;
            // Getters and setters
            public String getProgramId() { return programId; }
            public void setProgramId(String programId) { this.programId = programId; }
            public String getName() { return name; }
            public void setName(String name) { this.name = name; }
            public String getDescription() { return description; }
            public void setDescription(String description) { this.description = description; }
            public String getCategory() { return category; }
            public void setCategory(String category) { this.category = category; }
            public double getBudget() { return budget; }
            public void setBudget(double budget) { this.budget = budget; }
            public int getBeneficiariesReached() { return beneficiariesReached; }
            public void setBeneficiariesReached(int beneficiariesReached) { this.beneficiariesReached = beneficiariesReached; }
            public String getStatus() { return status; }
            public void setStatus(String status) { this.status = status; }
            public String getStartDate() { return startDate; }
            public void setStartDate(String startDate) { this.startDate = startDate; }
            public String getEndDate() { return endDate; }
            public void setEndDate(String endDate) { this.endDate = endDate; }
            public String getCoverImage() { return coverImage; }
            public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
        }

        public static class ContactPerson {
            private String name;
            private String position;
            private String email;
            private String phone;
            private String role;
            // Getters and setters
            public String getName() { return name; }
            public void setName(String name) { this.name = name; }
            public String getPosition() { return position; }
            public void setPosition(String position) { this.position = position; }
            public String getEmail() { return email; }
            public void setEmail(String email) { this.email = email; }
            public String getPhone() { return phone; }
            public void setPhone(String phone) { this.phone = phone; }
            public String getRole() { return role; }
            public void setRole(String role) { this.role = role; }
        }

        public static class EventRegistration {
            private Integer eventId;
            private String eventTitle;
            private String registrationDate;
            private String status;
            private String role;
            private List<String> servicesOffered;
            private double estimatedBudgetAllocated;
            private int expectedBeneficiaries;
            private String responseTime;
            private String notes;
            // Getters and setters
            public Integer getEventId() { return eventId; }
            public void setEventId(Integer eventId) { this.eventId = eventId; }
            public String getEventTitle() { return eventTitle; }
            public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
            public String getRegistrationDate() { return registrationDate; }
            public void setRegistrationDate(String registrationDate) { this.registrationDate = registrationDate; }
            public String getStatus() { return status; }
            public void setStatus(String status) { this.status = status; }
            public String getRole() { return role; }
            public void setRole(String role) { this.role = role; }
            public List<String> getServicesOffered() { return servicesOffered; }
            public void setServicesOffered(List<String> servicesOffered) { this.servicesOffered = servicesOffered; }
            public double getEstimatedBudgetAllocated() { return estimatedBudgetAllocated; }
            public void setEstimatedBudgetAllocated(double estimatedBudgetAllocated) { this.estimatedBudgetAllocated = estimatedBudgetAllocated; }
            public int getExpectedBeneficiaries() { return expectedBeneficiaries; }
            public void setExpectedBeneficiaries(int expectedBeneficiaries) { this.expectedBeneficiaries = expectedBeneficiaries; }
            public String getResponseTime() { return responseTime; }
            public void setResponseTime(String responseTime) { this.responseTime = responseTime; }
            public String getNotes() { return notes; }
            public void setNotes(String notes) { this.notes = notes; }
        }

        public static class RegistrationStatus {
            private String platformRegistrationDate;
            private String verificationStatus;
            private String approvalStatus;
            private boolean isActive;
            private String lastUpdated;
            // Getters and setters
            public String getPlatformRegistrationDate() { return platformRegistrationDate; }
            public void setPlatformRegistrationDate(String platformRegistrationDate) { this.platformRegistrationDate = platformRegistrationDate; }
            public String getVerificationStatus() { return verificationStatus; }
            public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
            public String getApprovalStatus() { return approvalStatus; }
            public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
            public boolean isActive() { return isActive; }
            public void setActive(boolean active) { isActive = active; }
            public String getLastUpdated() { return lastUpdated; }
            public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }
        }

        // --- Getters and Setters for Organization ---
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public OrganizationInfo getOrganizationInfo() { return organizationInfo; }
        public void setOrganizationInfo(OrganizationInfo organizationInfo) { this.organizationInfo = organizationInfo; }
        public AddressInfo getAddressInfo() { return addressInfo; }
        public void setAddressInfo(AddressInfo addressInfo) { this.addressInfo = addressInfo; }
        public LegalDocumentation getLegalDocumentation() { return legalDocumentation; }
        public void setLegalDocumentation(LegalDocumentation legalDocumentation) { this.legalDocumentation = legalDocumentation; }
        public OrganizationDetails getOrganizationDetails() { return organizationDetails; }
        public void setOrganizationDetails(OrganizationDetails organizationDetails) { this.organizationDetails = organizationDetails; }
        public FinancialInformation getFinancialInformation() { return financialInformation; }
        public void setFinancialInformation(FinancialInformation financialInformation) { this.financialInformation = financialInformation; }
        public Leadership getLeadership() { return leadership; }
        public void setLeadership(Leadership leadership) { this.leadership = leadership; }
        public List<Program> getPrograms() { return programs; }
        public void setPrograms(List<Program> programs) { this.programs = programs; }
        public List<ContactPerson> getContactPersons() { return contactPersons; }
        public void setContactPersons(List<ContactPerson> contactPersons) { this.contactPersons = contactPersons; }
        public List<EventRegistration> getEventRegistrations() { return eventRegistrations; }
        public void setEventRegistrations(List<EventRegistration> eventRegistrations) { this.eventRegistrations = eventRegistrations; }
        public RegistrationStatus getRegistrationStatus() { return registrationStatus; }
        public void setRegistrationStatus(RegistrationStatus registrationStatus) { this.registrationStatus = registrationStatus; }
    }
