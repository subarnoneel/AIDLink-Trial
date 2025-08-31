import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import getImgUrl, { getOrgFallbackImg } from '../../utils/getImgURL';
import { 
  FiMapPin, 
  FiUsers, 
  FiGlobe, 
  FiMail, 
  FiPhone, 
  FiStar, 
  FiHeart, 
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiFilter,
  FiSearch,
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiTarget,
  FiShield
} from 'react-icons/fi';

const Recipients = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Fetch organizations and events data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Conditional fetch based on whether we have an eventId
        if (eventId) {
          // Fetch organizations registered for a specific event from MongoDB
          try {
            const orgResponse = await fetch(`https://aidlink-trial.onrender.com/api/admin/organizations/approved-for-event/${eventId}`);
            if (orgResponse.ok) {
              const orgData = await orgResponse.json();
              setOrganizations(orgData || []);
              console.log("Fetched organizations from MongoDB API:", orgData);
              console.log("Using /api/admin/organizations/approved-for-event/" + eventId);
            } else {
              // Fallback to JSON file if API fails
              console.warn("Failed to fetch from API, falling back to local JSON file");
              const fallbackOrgResponse = await fetch('/registered_organizations.json');
              if (!fallbackOrgResponse.ok) {
                throw new Error('Failed to fetch organizations');
              }
              const fallbackOrgData = await fallbackOrgResponse.json();
              
              // Filter organizations by event registration
              const filteredOrgs = fallbackOrgData.filter(org => {
                if (!org.eventRegistrations || !Array.isArray(org.eventRegistrations)) {
                  return false;
                }
                // Use == for eventId comparison to handle string/number mismatch
                return org.eventRegistrations.some(reg => reg.eventId == eventId);
              });
              
              setOrganizations(filteredOrgs || []);
            }
          } catch (apiError) {
            console.error("API fetch error:", apiError);
            // Fallback to JSON file
            const fallbackOrgResponse = await fetch('/registered_organizations.json');
            if (!fallbackOrgResponse.ok) {
              throw new Error('Failed to fetch organizations');
            }
            const fallbackOrgData = await fallbackOrgResponse.json();
            
            // Filter organizations by event registration
            const filteredOrgs = fallbackOrgData.filter(org => {
              if (!org.eventRegistrations || !Array.isArray(org.eventRegistrations)) {
                return false;
              }
              // Use == for eventId comparison to handle string/number mismatch
              return org.eventRegistrations.some(reg => reg.eventId == eventId);
            });
            
            setOrganizations(filteredOrgs || []);
          }
          
          // Fetch event details
          try {
            const eventResponse = await fetch(`https://aidlink-trial.onrender.com/api/admin/events/${eventId}`);
            if (eventResponse.ok) {
              const eventData = await eventResponse.json();
              setSelectedEvent(eventData);
            } else {
              // Fallback to JSON file
              const fallbackEventResponse = await fetch('/events.json');
              if (!fallbackEventResponse.ok) {
                throw new Error('Failed to fetch events');
              }
              const fallbackEventData = await fallbackEventResponse.json();
              const event = fallbackEventData.find(e => e.id === eventId);
              setSelectedEvent(event);
            }
          } catch (apiError) {
            console.error("API fetch error for event:", apiError);
            // Fallback to JSON file
            const fallbackEventResponse = await fetch('/events.json');
            if (!fallbackEventResponse.ok) {
              throw new Error('Failed to fetch events');
            }
            const fallbackEventData = await fallbackEventResponse.json();
            const event = fallbackEventData.find(e => e.id === eventId);
            setSelectedEvent(event);
          }
        } else {
          // If no eventId is provided, fetch all organizations
          try {
            const orgResponse = await fetch('https://aidlink-trial.onrender.com/api/admin/organizations');
            if (orgResponse.ok) {
              const orgData = await orgResponse.json();
              setOrganizations(orgData || []);
            } else {
              // Fallback to JSON file
              const fallbackOrgResponse = await fetch('/registered_organizations.json');
              if (!fallbackOrgResponse.ok) {
                throw new Error('Failed to fetch organizations');
              }
              const fallbackOrgData = await fallbackOrgResponse.json();
              setOrganizations(fallbackOrgData || []);
            }
          } catch (apiError) {
            console.error("API fetch error:", apiError);
            // Fallback to JSON file
            const fallbackOrgResponse = await fetch('/registered_organizations.json');
            if (!fallbackOrgResponse.ok) {
              throw new Error('Failed to fetch organizations');
            }
            const fallbackOrgData = await fallbackOrgResponse.json();
            setOrganizations(fallbackOrgData || []);
          }
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Filter organizations based on search criteria and organization type
  useEffect(() => {
    if (!organizations || organizations.length === 0) {
      setFilteredOrganizations([]);
      return;
    }

    let filtered = [...organizations];

    // Organizations fetched from the API are already filtered by eventId and approval status,
    // so we don't need to filter by event registration again

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(org => 
        org.organizationInfo?.legalName?.toLowerCase().includes(term) ||
        org.organizationInfo?.commonName?.toLowerCase().includes(term) ||
        org.organizationInfo?.organizationType?.toLowerCase().includes(term) ||
        org.addressInfo?.headquarters?.city?.toLowerCase().includes(term) ||
        org.addressInfo?.headquarters?.country?.toLowerCase().includes(term)
      );
    }

    // Filter by organization type
    if (filterType !== 'all') {
      filtered = filtered.filter(org => 
        org.organizationInfo?.organizationType === filterType
      );
    }

    // Sort organizations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.organizationInfo?.legalName || '').localeCompare(b.organizationInfo?.legalName || '');
        case 'type':
          return (a.organizationInfo?.organizationType || '').localeCompare(b.organizationInfo?.organizationType || '');
        case 'location':
          return (a.addressInfo?.headquarters?.city || '').localeCompare(b.addressInfo?.headquarters?.city || '');
        case 'rating':
          return (b.performanceMetrics?.overallRating || 0) - (a.performanceMetrics?.overallRating || 0);
        default:
          return 0;
      }
    });

    setFilteredOrganizations(filtered);
  }, [organizations, searchTerm, filterType, sortBy]); // Removed eventId and selectedEvent from dependencies

  // Get unique organization types for filter dropdown
  const organizationTypes = [...new Set(
    organizations
      .map(org => org.organizationInfo?.organizationType)
      .filter(Boolean)
  )];

  const formatOrganizationType = (type) => {
    return type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  const getStatusBadge = (org) => {
    const isVerified = org.registrationStatus?.verificationStatus === 'verified';
    const isApproved = org.registrationStatus?.approvalStatus === 'approved';
    const isActive = org.registrationStatus?.isActive;

    if (isVerified && isApproved && isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          <FiCheckCircle className="h-3 w-3" />
          Verified
        </span>
      );
    } else if (org.registrationStatus?.verificationStatus === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          <FiAlertCircle className="h-3 w-3" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
          <FiShield className="h-3 w-3" />
          Unverified
        </span>
      );
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FiStar key={i} className="h-4 w-4 text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FiStar key={i} className="h-4 w-4 text-yellow-400 fill-current opacity-50" />);
      } else {
        stars.push(<FiStar key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedEvent ? `Organizations for ${selectedEvent.title}` : 'All Organizations'}
              </h1>
              <p className="text-gray-600 mt-2">
                {selectedEvent 
                  ? `Organizations registered to help with the ${selectedEvent.title} crisis`
                  : 'Browse all registered organizations ready to help in times of need'
                }
              </p>
            </div>
          </div>

          {/* Event Info Card */}
          {selectedEvent && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
                  <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
                  <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="h-4 w-4" />
                      {selectedEvent.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      {new Date(selectedEvent.startDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUsers className="h-4 w-4" />
                      {selectedEvent.estimatedAffectedPeople?.toLocaleString()} affected
                    </span>
                    <span className="flex items-center gap-1">
                      <FiTarget className="h-4 w-4" />
                      ${selectedEvent.fundingGoal?.toLocaleString()} needed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >
                <option value="all">All Types</option>
                {organizationTypes.map(type => (
                  <option key={type} value={type}>
                    {formatOrganizationType(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
              <option value="location">Sort by Location</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium">{filteredOrganizations.length}</span>
              <span className="ml-1">
                {filteredOrganizations.length === 1 ? 'organization' : 'organizations'} found
              </span>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        {filteredOrganizations.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
            <p className="text-gray-600">
              {eventId 
                ? "No organizations are currently registered for this crisis. Check back later as more organizations join."
                : "Try adjusting your search criteria or filters to find organizations."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <div key={org.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header with Logo */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Organization Logo */}
                      <div className="flex-shrink-0">
                        <img
                          src={org.organizationInfo?.logo ? getImgUrl(org.organizationInfo.logo) : `https://ui-avatars.com/api/?name=${encodeURIComponent(org.organizationInfo?.commonName || org.organizationInfo?.legalName || 'Organization')}&size=48&background=3b82f6&color=ffffff&format=png`}
                          alt={`${org.organizationInfo?.commonName || org.organizationInfo?.legalName} logo`}
                          className="w-12 h-12 rounded-lg object-cover border"
                          onError={(e) => {
                            // First fallback: organization type based image
                            const fallbackImg = getOrgFallbackImg(org.organizationInfo?.organizationType);
                            if (e.target.src !== fallbackImg) {
                              e.target.src = fallbackImg;
                            } else {
                              // Final fallback: avatar
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(org.organizationInfo?.commonName || org.organizationInfo?.legalName || 'Organization')}&size=48&background=6b7280&color=ffffff&format=png`;
                            }
                          }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {org.organizationInfo?.commonName || org.organizationInfo?.legalName || 'Unknown Organization'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatOrganizationType(org.organizationInfo?.organizationType)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(org)}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <FiMapPin className="h-4 w-4" />
                    <span>
                      {org.addressInfo?.headquarters?.city && org.addressInfo?.headquarters?.country
                        ? `${org.addressInfo.headquarters.city}, ${org.addressInfo.headquarters.country}`
                        : 'Location not specified'
                      }
                    </span>
                  </div>

                  {/* Rating */}
                  {org.performanceMetrics?.overallRating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {getRatingStars(org.performanceMetrics.overallRating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({org.performanceMetrics.overallRating.toFixed(1)})
                      </span>
                    </div>
                  )}

                  {/* Mission */}
                  {org.organizationDetails?.mission && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {org.organizationDetails.mission}
                    </p>
                  )}

                  {/* Featured Programs with Images */}
                  {org.programs && org.programs.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Active Programs:</p>
                      <div className="flex gap-2 overflow-x-auto">
                        {org.programs.slice(0, 3).map((program, idx) => (
                          <div key={idx} className="flex-shrink-0 bg-blue-50 rounded-lg p-2 min-w-[120px]">
                            <img
                              src={program.coverImage ? getImgUrl(program.coverImage) : `https://picsum.photos/120/64?random=${org.id}-${idx}`}
                              alt={program.name}
                              className="w-full h-16 object-cover rounded mb-2"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/120x64/3b82f6/ffffff?text=${encodeURIComponent(program.category || 'Program')}`;
                              }}
                            />
                            <p className="text-xs font-medium text-blue-900 line-clamp-2">
                              {program.name}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              {program.beneficiariesReached?.toLocaleString()} reached
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    {org.organizationDetails?.operationalCapacity?.staffCount && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <FiUsers className="h-4 w-4" />
                        <span>{org.organizationDetails.operationalCapacity.staffCount} staff</span>
                      </div>
                    )}
                    {org.financialInformation?.annualBudget?.totalBudget && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <FiDollarSign className="h-4 w-4" />
                        <span>${(org.financialInformation.annualBudget.totalBudget / 1000000).toFixed(1)}M</span>
                      </div>
                    )}
                  </div>

                  {/* Leadership */}
                  {org.leadership?.executiveDirector && (
                    <div className="mb-4 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={org.leadership.executiveDirector.photo ? getImgUrl(org.leadership.executiveDirector.photo) : `https://ui-avatars.com/api/?name=${encodeURIComponent(org.leadership.executiveDirector.name || 'Leader')}&size=40&background=059669&color=ffffff&format=png`}
                          alt={org.leadership.executiveDirector.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(org.leadership.executiveDirector.name || 'Leader')}&size=40&background=6b7280&color=ffffff&format=png`;
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {org.leadership.executiveDirector.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {org.leadership.executiveDirector.position}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Event-specific info */}
                  {eventId && org.eventRegistrations && (
                    <div className="mb-4">
                      {org.eventRegistrations
                        .filter(reg => reg.eventId === eventId)
                        .map((registration, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-blue-900">
                                Role: {registration.role?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                            {registration.servicesOffered && registration.servicesOffered.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-blue-700 mb-1">Services:</p>
                                <div className="flex flex-wrap gap-1">
                                  {registration.servicesOffered.slice(0, 3).map((service, idx) => (
                                    <span key={idx} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded">
                                      {service.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                  {registration.servicesOffered.length > 3 && (
                                    <span className="text-xs text-blue-600">
                                      +{registration.servicesOffered.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/recipients/${org.id}`}
                      className="flex-1 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <FiEye className="h-4 w-4" />
                      View Details
                    </Link>
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredOrganizations.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Showing {filteredOrganizations.length} of {organizations.length} organizations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipients;
