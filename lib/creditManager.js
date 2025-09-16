// Credit Management System
// Handles user credits with monthly reset functionality

export const CREDIT_CONFIG = {
  INITIAL_CREDITS: 4,
  MONTHLY_RESET_CREDITS: 4,
  CREDIT_RESET_DAY: 1, // 1st of every month
};

// Get the last reset date for a user
export function getLastResetDate(user) {
  if (!user?.lastCreditReset) {
    return new Date(); // If no reset date, use current date
  }
  return new Date(user.lastCreditReset);
}

// Check if credits should be reset (monthly)
export function shouldResetCredits(user) {
  const lastReset = getLastResetDate(user);
  const now = new Date();
  
  // Check if it's a new month since last reset
  const lastResetMonth = lastReset.getMonth();
  const lastResetYear = lastReset.getFullYear();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return (currentYear > lastResetYear) || 
         (currentYear === lastResetYear && currentMonth > lastResetMonth);
}

// Reset user credits to monthly allowance
export function resetUserCredits(user) {
  const now = new Date();
  return {
    ...user,
    credits: CREDIT_CONFIG.MONTHLY_RESET_CREDITS,
    lastCreditReset: now.toISOString(),
  };
}

// Initialize credits for new user
export function initializeUserCredits(userData) {
  const now = new Date();
  return {
    ...userData,
    credits: CREDIT_CONFIG.INITIAL_CREDITS,
    lastCreditReset: now.toISOString(),
  };
}

// Check if user has enough credits
export function hasEnoughCredits(user, requiredCredits = 1) {
  return user?.credits >= requiredCredits;
}

// Get credit status message
export function getCreditStatusMessage(user) {
  if (!user) return "No user data";
  
  const credits = user.credits || 0;
  const lastReset = getLastResetDate(user);
  const nextReset = new Date(lastReset);
  nextReset.setMonth(nextReset.getMonth() + 1);
  
  if (credits <= 0) {
    return `No credits left. Resets on ${nextReset.toLocaleDateString()}`;
  }
  
  return `${credits} interview${credits === 1 ? '' : 's'} remaining`;
}

// Get credit reset date
export function getNextResetDate(user) {
  const lastReset = getLastResetDate(user);
  const nextReset = new Date(lastReset);
  nextReset.setMonth(nextReset.getMonth() + 1);
  return nextReset;
}

