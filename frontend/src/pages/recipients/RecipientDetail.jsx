import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import getImgUrl, { getOrgFallbackImg } from '../../utils/getImgURL';
import { handleDonationAuth } from '../../utils/auth';
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiGlobe, 
  FiMail, 
  FiPhone, 
  FiUsers, 
  FiDollarSign, 
  FiStar, 
  FiShield, 
  FiHeart,
  FiExternalLink,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiDownload,
  FiEye,
  FiFileText,
  FiImage,
  FiUser,
  FiTarget,
  FiTrendingUp,
  FiShare2
} from "react-icons/fi";

const RecipientDetail = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationEventData, setDonationEventData] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        setLoading(true);
        console.log("Recipient ID from URL:", recipientId);
        
        // Get eventId from URL query parameters if available
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('eventId');
        if (eventId) {
          console.log("Event ID from URL:", eventId);
          setSelectedEventId(eventId);
        }
        
        // Try to fetch from backend API first
        try {
          const apiUrl = `http://localhost:8080/api/admin/organizations/${recipientId}`;
          console.log("Fetching from API URL:", apiUrl);
          
          const apiResponse = await fetch(apiUrl);
          if (apiResponse.ok) {
            const orgData = await apiResponse.json();
            console.log("Successfully fetched organization from API:", orgData);
            console.log("Organization ID from API:", orgData.id);
            setOrganization(orgData);
            setLoading(false);
            return;
          } else {
            console.warn("API request failed with status:", apiResponse.status);
          }
        } catch (apiError) {
          console.error("Error fetching from API:", apiError);
        }
        
        // Fallback to local JSON if API fails
        console.log("Falling back to local JSON file");
        const response = await fetch('/registered_organizations.json');
        if (!response.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const data = await response.json();
        const orgData = data.find(org => org.id === recipientId || org._id === recipientId);
        
        if (!orgData) {
          throw new Error('Organization not found');
        }
        
        setOrganization(orgData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (recipientId) {
      fetchOrganizationDetails();
    }
  }, [recipientId]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getStarRating = (rating) => {
    const stars = rating && typeof rating === 'string' ? parseInt(rating.split('_')[0] || '0') : 0;
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleDonate = () => {
    // Check authentication first
    if (!handleDonationAuth(navigate)) {
      return;
    }
    
    // Check if we have an event ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('eventId');
    
    // If there's no event ID in URL but organization has registered events,
    // use the first one as default
    if (!eventId && organization.eventRegistrations && organization.eventRegistrations.length > 0) {
      console.log("Organization has registered events:", organization.eventRegistrations);
      setSelectedEventId(organization.eventRegistrations[0].eventId);
    } else if (eventId) {
      setSelectedEventId(eventId);
    }
    
    setShowDonationModal(true);
  };

  const processDonation = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) return;
    try {
      let eventId = selectedEventId;
      if (!eventId) {
        alert("Error: Please select an event to donate to.");
        return;
      }
      const eventIdInt = parseInt(eventId);
      if (isNaN(eventIdInt)) {
        throw new Error(`Invalid event ID: ${eventId}. Must be a number.`);
      }
      // Get userEmail from localStorage
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert("Error: You must be logged in to donate.");
        return;
      }
      const response = await fetch(`http://localhost:8080/api/admin/events/${eventIdInt}/donate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parseInt(donationAmount), userEmail }),
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Event with ID ${eventIdInt} not found. Please select another event.`);
        } else {
          throw new Error(`Server returned error status: ${response.status} - ${response.statusText}`);
        }
      }
      const updatedEvent = await response.json();
      setDonationEventData(updatedEvent);
      setDonationSuccess(true);
      setShowDonationModal(false);
      setTimeout(() => {
        setDonationSuccess(false);
        setDonationEventData(null);
        setDonationAmount('');
      }, 5000);
    } catch (error) {
      alert(`Error processing donation: ${error.message}`);
      setShowDonationModal(false);
    }
  };

  const handleDocumentView = (doc) => {
    const fileName = doc.imageUrl || doc.reportUrl || doc.certificateUrl;
    const isPDF = fileName && fileName.includes('.pdf');
    
    // If it's a PDF, try to open it in a new tab directly
    if (isPDF) {
      const pdfUrl = getImgUrl(fileName);
      // Check if browser supports PDF viewing
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (!isMobile) {
        // For desktop browsers, try to open in a new tab
        window.open(pdfUrl, '_blank');
      } else {
        // On mobile or if direct opening fails, show the modal
        setSelectedDocument(doc);
      }
    } else {
      // For non-PDF documents, show the modal
      setSelectedDocument(doc);
    }
  };

  const handleDocumentDownload = async (doc) => {
    const fileName = doc.imageUrl || doc.reportUrl || doc.certificateUrl;
    const docType = doc.type || doc.name;
    
    if (!fileName) {
      alert('Document file not available for download');
      return;
    }

    try {
      // For development, we'll use placeholder files from public folder
      // In production, these would be actual document URLs from your server
      const downloadUrl = `/documents/${fileName}`;
      
      // Fetch the file
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        // If file doesn't exist, create a sample download
        downloadSampleFile(fileName, docType);
        return;
      }
      
      // Get the file as blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert(`Successfully downloaded ${docType}`);
      
    } catch (error) {
      console.error('Download error:', error);
      // Fallback to sample download
      downloadSampleFile(fileName, docType);
    }
  };

  const downloadSampleFile = (fileName, docType) => {
    // Create a sample file content for demonstration
    const fileExtension = fileName.split('.').pop().toLowerCase();
    let content, mimeType;
    
    if (fileExtension === 'pdf') {
      // Create a simple PDF-like content (this would be a real PDF in production)
      content = `Sample PDF Document: ${docType}\n\nThis is a placeholder for the actual document.\nIn a real application, this would be the actual PDF file.\n\nDocument: ${fileName}\nType: ${docType}\nGenerated: ${new Date().toLocaleString()}`;
      mimeType = 'application/pdf';
    } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      // For images, create a text file with image info
      content = `Image Document: ${docType}\n\nThis represents an image document.\nActual file: ${fileName}\nType: ${docType}\nGenerated: ${new Date().toLocaleString()}`;
      mimeType = 'text/plain';
      fileName = fileName.replace(/\.(jpg|jpeg|png)$/i, '.txt');
    } else {
      // Default text content
      content = `Document: ${docType}\n\nFile: ${fileName}\nGenerated: ${new Date().toLocaleString()}\n\nThis is a sample document for demonstration purposes.`;
      mimeType = 'text/plain';
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert(`Downloaded sample file: ${docType}`);
  };

  const renderDocumentViewer = (doc) => {
    if (!doc) {
      return (
        <div className="border rounded-lg p-4">
          <div className="text-center">
            <FiFileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Document not available</p>
          </div>
        </div>
      );
    }
    const fileName = doc.imageUrl || doc.reportUrl || doc.certificateUrl;
    const isImage = fileName && (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.jpeg'));
    const isPDF = fileName && fileName.includes('.pdf');

    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {isImage ? <FiImage className="h-5 w-5 text-blue-500" /> : <FiFileText className="h-5 w-5 text-red-500" />}
            <span className="font-medium">{doc.type || doc.name}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDocumentView(doc)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View Document"
            >
              <FiEye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDocumentDownload(doc)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Download Document"
            >
              <FiDownload className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {isImage ? (
          <div className="bg-gray-100 rounded-md h-32 flex items-center justify-center overflow-hidden">
            <img
              src={getImgUrl(fileName)}
              alt={doc.type || doc.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `<span class="text-gray-500 text-sm">Image Preview: ${fileName}</span>`;
              }}
            />
          </div>
        ) : isPDF ? (
          <div className="bg-red-50 rounded-md h-32 flex flex-col items-center justify-center p-2">
            <FiFileText className="h-8 w-8 text-red-500 mb-2" />
            <span className="text-red-700 font-medium text-sm">{doc.type || "PDF Document"}</span>
            <span className="text-xs text-red-600 mt-1 text-center max-w-full truncate">
              {fileName.split('/').pop()}
            </span>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-md h-32 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Document: {fileName}</span>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          {doc.issueDate && `Issued: ${new Date(doc.issueDate).toLocaleDateString()}`}
          {doc.expiryDate && ` | Expires: ${new Date(doc.expiryDate).toLocaleDateString()}`}
          {doc.isVerified && (
            <span className="inline-flex items-center ml-2 text-green-600">
              <FiCheckCircle className="h-3 w-3 mr-1" />
              Verified
            </span>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organization details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <Link 
            to="/recipients"
            className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
          >
            Back to Recipients
          </Link>
        </div>
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-light py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/recipients"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6 font-medium"
          onClick={(e) => {
            // Check if we should go back to the event detail page
            const urlParams = new URLSearchParams(window.location.search);
            const eventId = urlParams.get('eventId');
            if (eventId) {
              e.preventDefault();
              window.location.href = `/events/${eventId}`;
            }
          }}
        >
          <FiArrowLeft className="mr-2" />
          Back to {window.location.search.includes('eventId=') ? 'Event' : 'Recipients'}
        </Link>
        
        {/* Donation Success Banner */}
        {donationSuccess && donationEventData && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded-md">
            <div className="flex items-center">
              <FiCheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <p className="font-bold text-green-800">Donation Successful!</p>
                <p className="text-green-700">
                  Thank you for donating ${donationAmount} to support this cause.
                  The event has now raised ${donationEventData.currentFunding} of ${donationEventData.fundingGoal}.
                </p>
                <Link
                  to={`/events/${donationEventData.id}`}
                  className="mt-2 inline-block text-green-600 hover:text-green-800 font-medium"
                >
                  View event progress →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                {organization.organizationInfo?.logo ? (
                  <img
                    src={getImgUrl(organization.organizationInfo.logo)}
                    alt={`${organization.organizationInfo.commonName} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // First fallback: organization type based image
                      const fallbackImg = getOrgFallbackImg(organization.organizationInfo?.organizationType);
                      if (e.target.src !== fallbackImg) {
                        e.target.src = fallbackImg;
                      } else {
                        // Final fallback: show acronym
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="text-3xl font-bold text-primary">${organization.organizationInfo.acronym}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {organization.organizationInfo.acronym}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">
                  {organization.organizationInfo.legalName}
                </h1>
                <p className="text-gray-600 text-lg">{organization.organizationInfo.commonName}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <FiShield className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Verified Organization</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getStarRating(organization.financialInformation?.transparencyRating)}
                    <span className="text-sm text-gray-600 ml-2">
                      {organization.financialInformation?.transparencyRating ? 
                        organization.financialInformation.transparencyRating.replace('_', ' ') : 
                        'Not Rated'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDonate}
                className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FiHeart />
                <span>Donate Now</span>
              </button>
              <button className="border border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                <FiShare2 />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        
            {/* bKash Donation Banner */}
        <div className="bg-pink-100 rounded-lg shadow-md p-6 mb-6 border-2 border-pink-300">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-md">
                <span className="text-pink-600 font-bold text-2xl">b</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-pink-800 mb-1">Please use bKash and donate your money here</h2>
                <div className="flex items-center">
                  <span className="font-semibold text-pink-700 mr-2">bKash Number:</span>
                  <span className="bg-white px-3 py-1 rounded-md text-pink-600 font-bold text-lg border border-pink-300">01977108849</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleDonate}
              className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              <FiHeart />
              <span>Donate via bKash</span>
            </button>
          </div>
        </div>        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FiUser },
                { id: 'programs', label: 'Programs', icon: FiTarget },
                { id: 'financials', label: 'Financials', icon: FiDollarSign },
                { id: 'documents', label: 'Documents', icon: FiFileText },
                { id: 'leadership', label: 'Leadership', icon: FiUsers }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Mission & Vision</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Mission</h4>
                      <p className="text-blue-800">
                        {organization.organizationDetails?.mission || 'Mission statement not provided'}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Vision</h4>
                      <p className="text-green-800">
                        {organization.organizationDetails?.vision || 'Vision statement not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {(organization.organizationDetails?.focusAreas || []).map((area, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {area.replace('_', ' ').toUpperCase()}
                      </span>
                    ))}
                    {(!organization.organizationDetails?.focusAreas || organization.organizationDetails.focusAreas.length === 0) && (
                      <span className="text-gray-500">Focus areas not specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Headquarters</p>
                          {organization.addressInfo?.headquarters ? (
                            <p className="text-gray-600">
                              {organization.addressInfo.headquarters.street || 'Street not provided'}<br />
                              {organization.addressInfo.headquarters.city || 'City not provided'}{organization.addressInfo.headquarters.state ? `, ${organization.addressInfo.headquarters.state}` : ''}<br />
                              {organization.addressInfo.headquarters.country || 'Country not provided'} {organization.addressInfo.headquarters.zipCode || ''}
                            </p>
                          ) : (
                            <p className="text-gray-600">
                              Headquarters information not available
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-gray-600">{organization.organizationInfo?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiMail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600">{organization.organizationInfo?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiGlobe className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Website</p>
                          {organization.organizationInfo?.website ? (
                            <a href={organization.organizationInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {organization.organizationInfo.website}
                            </a>
                          ) : (
                            <p className="text-gray-600">Not provided</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* bKash Donation Section in Overview Tab */}
                <div className="bg-pink-50 p-5 rounded-lg border border-pink-200">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center mr-2 shadow-sm">
                      <span className="text-pink-600 font-bold text-xl">b</span>
                    </div>
                    Donation Information
                  </h3>
                  <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-2">Please use bKash and donate your money here:</p>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="bg-white rounded-lg p-4 border border-pink-200 flex-1">
                        <p className="text-sm text-gray-600 mb-1">bKash Number</p>
                        <p className="text-2xl font-bold text-pink-600">01977108849</p>
                      </div>
                      <div className="flex md:flex-col gap-2">
                        <button
                          onClick={handleDonate}
                          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <FiHeart />
                          <span>Donate Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-pink-100">
                    <h4 className="font-medium text-gray-800 mb-2">How to donate:</h4>
                    <ol className="text-sm text-gray-700 space-y-1 pl-5 list-decimal">
                      <li>Open your bKash app or dial *247#</li>
                      <li>Send your donation to the bKash number above</li>
                      <li>Click "Donate Now" and enter your transaction details</li>
                      <li>Your donation will help support our programs</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Operational Regions</h3>
                  <div className="space-y-3">
                    {(organization.addressInfo?.operationalRegions || []).map((region, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{region.region}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${region.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {region.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{region.countries?.join(', ')}</p>
                      </div>
                    ))}
                    {(!organization.addressInfo?.operationalRegions || organization.addressInfo.operationalRegions.length === 0) && (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        <FiMapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Operational regions not specified</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Active Programs</h3>
                {(organization.programs || []).length > 0 ? (
                  organization.programs.map((program, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Program Image */}
                        {program.coverImage && (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getImgUrl(program.coverImage)}
                              alt={program.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = getOrgFallbackImg('community_organization');
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{program.name}</h4>
                          <p className="text-gray-600">{program.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        program.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {program.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-bold text-lg">${formatNumber(program.budget)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Beneficiaries Reached</p>
                        <p className="font-bold text-lg">{formatNumber(program.beneficiariesReached)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-bold text-sm">
                          {new Date(program.startDate).toLocaleDateString()} - {new Date(program.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiTarget className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No active programs available</p>
                  </div>
                )}
              </div>
            )}

            {/* Financials Tab */}
            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Annual Budget {organization.financialInformation?.annualBudget?.year ? 
                      `(${organization.financialInformation.annualBudget.year})` : 
                      ''}
                  </h3>
                  {organization.financialInformation?.annualBudget ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Total Budget</p>
                        <p className="text-2xl font-bold text-blue-900">${formatNumber(organization.financialInformation.annualBudget.totalBudget || 0)}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600">Program Expenses</p>
                        <p className="text-2xl font-bold text-green-900">${formatNumber(organization.financialInformation.annualBudget.programExpenses || 0)}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-600">Administrative</p>
                        <p className="text-2xl font-bold text-yellow-900">${formatNumber(organization.financialInformation.annualBudget.administrativeExpenses || 0)}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600">Program Efficiency</p>
                        <p className="text-2xl font-bold text-purple-900">{organization.financialInformation.annualBudget.programEfficiencyRatio || 0}%</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Annual budget information not available</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Funding Sources</h3>
                  <div className="space-y-3">
                    {(organization.financialInformation?.fundingSources || []).map((source, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{source.source.replace('_', ' ').toUpperCase()}</span>
                          <span className="font-bold">{source.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">${formatNumber(source.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Legal Documentation</h3>
                  {organization.legalDocumentation ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {organization.legalDocumentation.incorporationCertificate && 
                        renderDocumentViewer(organization.legalDocumentation.incorporationCertificate)}
                      {organization.legalDocumentation.taxExemptStatus && 
                        renderDocumentViewer(organization.legalDocumentation.taxExemptStatus)}
                      {organization.legalDocumentation.operatingLicense && 
                        renderDocumentViewer(organization.legalDocumentation.operatingLicense)}
                      {!organization.legalDocumentation.incorporationCertificate && 
                       !organization.legalDocumentation.taxExemptStatus && 
                       !organization.legalDocumentation.operatingLicense && (
                        <div className="col-span-2 text-center py-8 text-gray-500">
                          <p>No legal documentation available</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Legal documentation not available</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Audit Reports</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(organization.legalDocumentation?.auditReports || []).map((audit, index) => (
                      <div key={index}>
                        {renderDocumentViewer({
                          type: `${audit.year} Audit Report`,
                          reportUrl: audit.reportUrl,
                          issueDate: audit.auditDate,
                          isVerified: audit.isVerified
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {organization.certifications && organization.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {organization.certifications.map((cert, index) => (
                        <div key={index}>
                          {renderDocumentViewer({
                            name: cert.name,
                            certificateUrl: cert.certificateUrl,
                            issueDate: cert.issueDate,
                            expiryDate: cert.expiryDate,
                            isVerified: cert.isActive
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Leadership Tab */}
            {activeTab === 'leadership' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Executive Leadership</h3>
                  <div className="border rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {organization.leadership?.executiveDirector?.photo ? (
                          <img
                            src={getImgUrl(organization.leadership.executiveDirector.photo)}
                            alt={organization.leadership.executiveDirector.name}
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(organization.leadership.executiveDirector.name || 'Director')}&size=64&background=059669&color=ffffff&format=png`;
                            }}
                          />
                        ) : (
                          <FiUser className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{organization.leadership.executiveDirector.name}</h4>
                        <p className="text-primary font-medium">{organization.leadership.executiveDirector.position}</p>
                        <p className="text-gray-600 mt-2">{organization.leadership.executiveDirector.bio}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <div className="flex items-center space-x-2">
                            <FiMail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{organization.leadership.executiveDirector.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiPhone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{organization.leadership.executiveDirector.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Board of Directors</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {organization.leadership?.boardOfDirectors?.length > 0 ? (
                      organization.leadership.boardOfDirectors.map((member, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                              {member.photo ? (
                                <img
                                  src={getImgUrl(member.photo)}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'Member')}&size=48&background=6b7280&color=ffffff&format=png`;
                                  }}
                                />
                              ) : (
                                <FiUser className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold">{member.name}</h4>
                              <p className="text-primary text-sm font-medium">{member.position}</p>
                              <p className="text-gray-600 text-sm mt-1">{member.background}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        <FiUsers className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Board member information not available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              Donate to {organization.organizationInfo.commonName}
            </h3>
            
            {/* Only show event selection if eventId is NOT present in the URL */}
            {(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const eventIdFromUrl = urlParams.get('eventId');
              if (!eventIdFromUrl && organization.eventRegistrations && organization.eventRegistrations.length > 0) {
                return (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Event to Support
                    </label>
                    <select 
                      value={selectedEventId || ''} 
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="" disabled>Select an event</option>
                      {organization.eventRegistrations.map((reg, index) => (
                        <option key={index} value={reg.eventId}>
                          {reg.eventTitle || `Event #${reg.eventId}`}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              return null;
            })()}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount ($)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {[100, 250, 500].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount.toString())}
                  className="py-2 px-3 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  ${amount}
                </button>
              ))}
            </div>
            
            {/* bKash Info Section */}
            <div className="bg-pink-50 p-4 rounded-md mb-6 border border-pink-200">
              <div className="flex items-center mb-2">
                <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                  <span className="text-pink-600 font-bold text-xl">b</span>
                </div>
                <h4 className="font-bold text-pink-800">bKash Payment Information</h4>
              </div>
              <p className="text-gray-700 mb-2">Please use bKash to donate:</p>
              <div className="flex items-center bg-white rounded-md p-2 border border-pink-200 mb-3">
                <span className="text-gray-600 mr-2">bKash Number:</span>
                <span className="text-pink-600 font-bold">01977108849</span>
              </div>
              <p className="text-sm text-gray-600">
                1. Send your donation to this bKash number
                <br/>
                2. Enter your donation amount above
                <br/>
                3. Click the Donate button below
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDonationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={processDonation}
                disabled={!selectedEventId || !donationAmount || parseFloat(donationAmount) <= 0}
                className="flex-1 bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedDocument.type || selectedDocument.name}</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {(() => {
                const fileName = selectedDocument.imageUrl || selectedDocument.reportUrl || selectedDocument.certificateUrl;
                const isImage = fileName && (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.jpeg'));
                const isPDF = fileName && fileName.includes('.pdf');
                
                return (
                  <>
                    <div className="bg-gray-100 rounded-lg min-h-[300px] flex items-center justify-center mb-4">
                      {isImage ? (
                        <img
                          src={getImgUrl(fileName)}
                          alt={selectedDocument.type || selectedDocument.name}
                          className="max-w-full max-h-[400px] object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<div class="text-center p-8">
                              <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p class="text-gray-600">Image could not be loaded</p>
                              <p class="text-sm text-gray-500">${fileName}</p>
                            </div>`;
                          }}
                        />
                      ) : isPDF ? (
                        <div className="text-center p-8">
                          <FiFileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
                          <p className="text-gray-700 font-medium">PDF Document</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {fileName.split('/').pop()}
                          </p>
                          <p className="text-xs text-gray-400 mt-4">
                            Click the download button below to view the full document
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <FiFileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Document Preview</p>
                          <p className="text-sm text-gray-500">
                            {fileName}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleDocumentDownload(selectedDocument)}
                        className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <FiDownload />
                        Download Document
                      </button>
                      {isPDF && (
                        <a
                          href={getImgUrl(fileName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-primary text-primary hover:bg-primary hover:text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                          <FiExternalLink />
                          Open in New Tab
                        </a>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipientDetail;
