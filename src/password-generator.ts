/**
 * Generates secure random passwords meeting QoreChain requirements:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 */

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Generate a random password that meets all requirements
 * @returns Random password string
 */
export function generatePassword(): string {
  // Ensure we have at least one of each required character type
  const uppercase = UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)];
  const lowercase = LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)];
  const number = NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)];
  const special = SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];
  
  // Fill the rest with random characters from all sets
  const allChars = UPPERCASE_CHARS + LOWERCASE_CHARS + NUMBER_CHARS + SPECIAL_CHARS;
  const remainingLength = 8; // Total length will be 12 characters
  let password = uppercase + lowercase + number + special;
  
  for (let i = 0; i < remainingLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to make it more random
  return shuffleString(password);
}

/**
 * Shuffle a string randomly
 * @param str String to shuffle
 * @returns Shuffled string
 */
function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

/**
 * Validate if password meets requirements
 * @param password Password to validate
 * @returns Object with validation result and any errors
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
