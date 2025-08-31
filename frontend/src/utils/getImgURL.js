// Import event images
import feniFlood from '../assets/events/feni-flood.jpg';
import burigangaPollution from '../assets/events/buriganga-pollution.jpg';
import cycloneMocha from '../assets/events/cyclone-mocha.jpg';
import rohingyaCrisis from '../assets/events/rohingya-crisis.jpg';
import sylhetFloods from '../assets/events/sylhet-floods.jpg';
import dhakaFire from '../assets/events/dhaka-fire.jpg';

// Import recipient/organization images
import grfLogo from '../assets/Recipients/grf_logo.png';
import sarahMitchell from '../assets/Recipients/sarah_mitchell.jpg';
import hurricaneResponseProgram from '../assets/Recipients/hurricane_response_program.jpg';
import communityResilienceProgram from '../assets/Recipients/community_resilience_program.jpg';

// Import fallback images from general assets
import handsImg from '../assets/hands.jpg';
import healthImg from '../assets/HealthCause.jpg';
import oldPeopleImg from '../assets/Oldpeople.jpg';
import foodImg from '../assets/food.jpg';
import crisisImg from '../assets/crisis.jpeg';
import emergencyImg from '../assets/emergency.jpg';

// Utility function to get image URL for events, organizations, and programs
const getImgUrl = (imageName) => {
  // If imageName is a full URL (Cloudinary or other), return it directly
  if (typeof imageName === 'string' && (imageName.startsWith('http://') || imageName.startsWith('https://'))) {
    return imageName;
  }
  const imageMap = {
    // Event images
    'feni-flood.jpg': feniFlood,
    'buriganga-pollution.jpg': burigangaPollution,
    'cyclone-mocha.jpg': cycloneMocha,
    'rohingya-crisis.jpg': rohingyaCrisis,
    'sylhet-floods.jpg': sylhetFloods,
    'dhaka-fire.jpg': dhakaFire,
    'rangpur-drought.jpg': crisisImg,
    'cht-landslide.jpg': emergencyImg,
    'coastal-erosion.jpg': crisisImg,
    'slum-health.jpg': healthImg,
    'sundarbans-spill.jpg': emergencyImg,
    'cold-wave.jpg': oldPeopleImg,
    'factory-fire.jpg': emergencyImg,
    'education-crisis.jpg': foodImg,
    'arsenic-crisis.jpg': healthImg,
    'bridge-collapse.jpg': emergencyImg,
    'elderly-care.jpg': oldPeopleImg,
    'street-children.jpg': handsImg,
    'disability-support.jpg': oldPeopleImg,
    'mental-health.jpg': healthImg,
    
    // Organization/Recipient images
    'grf_logo.png': grfLogo,
    'sarah_mitchell.jpg': sarahMitchell,
    'hurricane_response_program.jpg': hurricaneResponseProgram,
    'community_resilience_program.jpg': communityResilienceProgram,
  };
  // Return the mapped image or a default image
  return imageMap[imageName] || handsImg;
};

// Helper function to get fallback image based on organization type
export const getOrgFallbackImg = (orgType) => {
  const fallbackMap = {
    'non_governmental_organization': handsImg,
    'healthcare_organization': healthImg,
    'educational_institution': foodImg,
    'religious_organization': handsImg,
    'government_agency': emergencyImg,
    'international_organization': crisisImg,
    'community_organization': handsImg,
    'private_foundation': oldPeopleImg,
  };
  return fallbackMap[orgType] || handsImg;
};

export default getImgUrl;
