// Authentication utility functions

/**
 * Check if user is currently signed in
 * @returns {boolean} True if user is signed in, false otherwise
 */
export const isUserSignedIn = () => {
  return localStorage.getItem('isSignedIn') === 'true';
};

/**
 * Get the current user's email
 * @returns {string|null} User email if signed in, null otherwise
 */
export const getCurrentUserEmail = () => {
  return localStorage.getItem('userEmail');
};

/**
 * Check if user can donate (must be signed in)
 * @returns {boolean} True if user can donate, false otherwise
 */
export const canUserDonate = () => {
  return isUserSignedIn();
};

/**
 * Handle donation authentication - redirect to login if not signed in
 * @param {Function} navigate - React Router navigate function
 * @param {string} redirectPath - Path to redirect after login (optional)
 * @returns {boolean} True if user can donate, false if redirected to login
 */
export const handleDonationAuth = (navigate, redirectPath = null) => {
  if (!isUserSignedIn()) {
    // Store the current path to redirect back after login
    if (redirectPath) {
      localStorage.setItem('redirectAfterLogin', redirectPath);
    } else {
      localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
    }
    
    // Show message and redirect to login
    alert('Please sign in to make a donation. You will be redirected to the login page.');
    navigate('/login');
    return false;
  }
  return true;
};

/**
 * Get redirect path after login (if any)
 * @returns {string|null} Redirect path or null
 */
export const getRedirectAfterLogin = () => {
  const redirectPath = localStorage.getItem('redirectAfterLogin');
  if (redirectPath) {
    localStorage.removeItem('redirectAfterLogin');
    return redirectPath;
  }
  return null;
};

/**
 * Sign out user
 */
export const signOut = () => {
  localStorage.removeItem('isSignedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('redirectAfterLogin');
};
