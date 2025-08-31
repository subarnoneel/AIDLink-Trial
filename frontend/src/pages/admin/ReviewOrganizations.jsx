import React, { useEffect, useState } from 'react';
import { FiEye, FiCheck, FiX, FiFileText, FiMapPin, FiMail, FiPhone, FiGlobe, FiUsers, FiDollarSign, FiAward, FiCalendar } from 'react-icons/fi';

export default function ReviewOrganizations() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPendingOrganizations();
  }, []);

  const fetchPendingOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/pending-organizations');
      if (response.ok) {
        const data = await response.json();
        console.log('Pending organizations:', data);
        setOrgs(data);
      } else {
        console.error('Failed to fetch pending organizations');
      }
    } catch (error) {
      console.error('Error fetching pending organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveOrg = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/approve-organization/${id}`, { 
        method: 'POST' 
      });
      if (response.ok) {
        setOrgs(orgs.filter(org => org.id !== id));
        setShowModal(false);
        setSelectedOrg(null);
        alert('Organization approved successfully!');
      } else {
        alert('Failed to approve organization');
      }
    } catch (error) {
      console.error('Error approving organization:', error);
      alert('Error approving organization');
    }
  };

  const rejectOrg = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this organization? This action cannot be undone.')) {
      return;
    }

    console.log('Attempting to reject organization with ID:', id);
    console.log('Making request to:', `http://localhost:8080/api/admin/reject-organization/${id}`);

    try {
      const response = await fetch(`http://localhost:8080/api/admin/reject-organization/${id}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const result = await response.text();
        console.log('Rejection successful:', result);
        setOrgs(orgs.filter(org => org.id !== id));
        setShowModal(false);
        setSelectedOrg(null);
        alert('Organization rejected and deleted successfully!');
      } else {
        const errorText = await response.text();
        console.error('Rejection failed:', errorText);
        alert(`Failed to reject organization: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error rejecting organization:', error);
      alert('Error rejecting organization: ' + error.message);
    }
  };

  const openOrgDetails = (org) => {
    setSelectedOrg(org);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrg(null);
  };

  const renderDocumentImage = (imageUrl, documentName) => {
    if (!imageUrl) {
      return (
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
          <div className="text-center">
            <FiFileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No {documentName} uploaded</p>
          </div>
        </div>
      );
    }

    // Check if it's an image or PDF
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl);
    
    if (isImage) {
      return (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={documentName}
            className="w-full h-32 object-cover rounded-lg border"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <FiFileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Image not available</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
          <div className="text-center">
            <FiFileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">PDF Document</p>
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              View Document
            </a>
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading pending organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pending Organizations</h1>
          <p className="text-gray-600">Review and approve organization registrations</p>
        </div>

        {/* Organizations List */}
        {orgs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FiUsers className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Organizations</h3>
            <p className="text-gray-600">All organization registrations have been reviewed.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orgs.map(org => (
              <div key={org.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {org.organizationInfo?.logo && (
                        <img 
                          src={org.organizationInfo.logo} 
                          alt="Logo" 
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {org.organizationInfo?.legalName || 'N/A'}
                        </h3>
                        {org.organizationInfo?.acronym && (
                          <p className="text-sm text-gray-500">({org.organizationInfo.acronym})</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FiMail className="h-4 w-4 text-gray-400" />
                        <span>{org.organizationInfo?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="h-4 w-4 text-gray-400" />
                        <span>{org.organizationInfo?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiGlobe className="h-4 w-4 text-gray-400" />
                        <span>{org.organizationInfo?.website || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-4 w-4 text-gray-400" />
                        <span>
                          {org.addressInfo?.headquarters?.city && org.addressInfo?.headquarters?.country 
                            ? `${org.addressInfo.headquarters.city}, ${org.addressInfo.headquarters.country}`
                            : 'N/A'
                          }
                        </span>
                      </div>
                    </div>

                    {org.organizationDetails?.mission && (
                      <p className="text-gray-600 mt-3 text-sm line-clamp-2">
                        {org.organizationDetails.mission}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => openOrgDetails(org)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <FiEye className="h-4 w-4" />
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Organization Details Modal */}
        {showModal && selectedOrg && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Review Organization: {selectedOrg.organizationInfo?.legalName}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Organization Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiUsers className="h-5 w-5" />
                    Organization Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Legal Name</label>
                      <p className="text-gray-900">{selectedOrg.organizationInfo?.legalName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Common Name</label>
                      <p className="text-gray-900">{selectedOrg.organizationInfo?.commonName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Organization Type</label>
                      <p className="text-gray-900">{selectedOrg.organizationInfo?.organizationType || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Established Date</label>
                      <p className="text-gray-900">{selectedOrg.organizationInfo?.establishedDate || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedOrg.organizationInfo?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedOrg.organizationInfo?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <p className="text-gray-900">
                        {selectedOrg.organizationInfo?.website ? (
                          <a href={selectedOrg.organizationInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            {selectedOrg.organizationInfo.website}
                          </a>
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Registration Number</label>
                      <p className="text-gray-900">{selectedOrg.organizationInfo?.registrationNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                {selectedOrg.addressInfo?.headquarters && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiMapPin className="h-5 w-5" />
                      Headquarters Address
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">
                        {selectedOrg.addressInfo.headquarters.street && (
                          <span>{selectedOrg.addressInfo.headquarters.street}<br /></span>
                        )}
                        {selectedOrg.addressInfo.headquarters.city && selectedOrg.addressInfo.headquarters.state && (
                          <span>{selectedOrg.addressInfo.headquarters.city}, {selectedOrg.addressInfo.headquarters.state} {selectedOrg.addressInfo.headquarters.zipCode}<br /></span>
                        )}
                        {selectedOrg.addressInfo.headquarters.country}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mission & Vision */}
                {(selectedOrg.organizationDetails?.mission || selectedOrg.organizationDetails?.vision) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiAward className="h-5 w-5" />
                      Mission & Vision
                    </h3>
                    {selectedOrg.organizationDetails?.mission && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrg.organizationDetails.mission}</p>
                      </div>
                    )}
                    {selectedOrg.organizationDetails?.vision && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrg.organizationDetails.vision}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Operational Capacity */}
                {selectedOrg.organizationDetails?.operationalCapacity && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiUsers className="h-5 w-5" />
                      Operational Capacity
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Staff Count</label>
                        <p className="text-gray-900">{selectedOrg.organizationDetails.operationalCapacity.staffCount || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Volunteers</label>
                        <p className="text-gray-900">{selectedOrg.organizationDetails.operationalCapacity.volunteersCount || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Response Teams</label>
                        <p className="text-gray-900">{selectedOrg.organizationDetails.operationalCapacity.emergencyResponseTeams || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mobilization Time</label>
                        <p className="text-gray-900">{selectedOrg.organizationDetails.operationalCapacity.mobilizationTime || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Financial Information */}
                {selectedOrg.financialInformation?.annualBudget && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiDollarSign className="h-5 w-5" />
                      Financial Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Budget</label>
                        <p className="text-gray-900">
                          ${selectedOrg.financialInformation.annualBudget.totalBudget?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Program Expenses</label>
                        <p className="text-gray-900">
                          ${selectedOrg.financialInformation.annualBudget.programExpenses?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Efficiency Ratio</label>
                        <p className="text-gray-900">
                          {selectedOrg.financialInformation.annualBudget.programEfficiencyRatio || 'N/A'}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Leadership */}
                {selectedOrg.leadership?.executiveDirector && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiAward className="h-5 w-5" />
                      Executive Director
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start gap-4">
                        {selectedOrg.leadership.executiveDirector.photo && (
                          <img 
                            src={selectedOrg.leadership.executiveDirector.photo} 
                            alt="Executive Director" 
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{selectedOrg.leadership.executiveDirector.name || 'N/A'}</h4>
                          <p className="text-gray-600">{selectedOrg.leadership.executiveDirector.position || 'N/A'}</p>
                          <p className="text-gray-600">{selectedOrg.leadership.executiveDirector.email || 'N/A'}</p>
                          {selectedOrg.leadership.executiveDirector.bio && (
                            <p className="text-gray-700 mt-2 text-sm">{selectedOrg.leadership.executiveDirector.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legal Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiFileText className="h-5 w-5" />
                    Legal Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Incorporation Certificate */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Incorporation Certificate</h4>
                      {renderDocumentImage(
                        selectedOrg.legalDocumentation?.incorporationCertificate?.imageUrl,
                        'Incorporation Certificate'
                      )}
                      {selectedOrg.legalDocumentation?.incorporationCertificate?.documentNumber && (
                        <p className="text-sm text-gray-600 mt-2">
                          Doc #: {selectedOrg.legalDocumentation.incorporationCertificate.documentNumber}
                        </p>
                      )}
                    </div>

                    {/* Tax Exempt Status */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tax Exempt Status</h4>
                      {renderDocumentImage(
                        selectedOrg.legalDocumentation?.taxExemptStatus?.imageUrl,
                        'Tax Exempt Certificate'
                      )}
                      {selectedOrg.legalDocumentation?.taxExemptStatus?.status && (
                        <p className="text-sm text-gray-600 mt-2">
                          Status: {selectedOrg.legalDocumentation.taxExemptStatus.status}
                        </p>
                      )}
                    </div>

                    {/* Operating License */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Operating License</h4>
                      {renderDocumentImage(
                        selectedOrg.legalDocumentation?.operatingLicense?.imageUrl,
                        'Operating License'
                      )}
                      {selectedOrg.legalDocumentation?.operatingLicense?.licenseNumber && (
                        <p className="text-sm text-gray-600 mt-2">
                          License #: {selectedOrg.legalDocumentation.operatingLicense.licenseNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Registrations */}
                {selectedOrg.eventRegistrations && selectedOrg.eventRegistrations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiCalendar className="h-5 w-5" />
                      Event Registrations
                    </h3>
                    <div className="space-y-3">
                      {selectedOrg.eventRegistrations.map((registration, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900">{registration.eventTitle}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                            <div>
                              <span className="text-gray-600">Role:</span> {registration.role}
                            </div>
                            <div>
                              <span className="text-gray-600">Response Time:</span> {registration.responseTime}
                            </div>
                            <div>
                              <span className="text-gray-600">Budget:</span> ${registration.estimatedBudgetAllocated?.toLocaleString()}
                            </div>
                            <div>
                              <span className="text-gray-600">Beneficiaries:</span> {registration.expectedBeneficiaries}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => rejectOrg(selectedOrg.id)}
                  className="px-6 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => approveOrg(selectedOrg.id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FiCheck className="h-4 w-4" />
                  Approve Organization
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}