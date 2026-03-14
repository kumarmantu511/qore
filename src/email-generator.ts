/**
 * Generates a random email address for testing purposes
 * Format: {randomName}{randomNumber}@{randomDomain}
 */

const FIRST_NAMES = [
  'alex', 'john', 'emma', 'liam', 'olivia', 'noah', 'ava', 'sophia', 'jackson', 'mia',
  'lucas', 'charlotte', 'mason', 'amelia', 'ethan', 'harper', 'logan', 'evelyn', 'aiden', 'abigail',
  'james', 'emily', 'benjamin', 'elizabeth', 'william', 'sofia', 'oliver', 'camila', 'henry', 'aria'
];

const EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'protonmail.com',
  'icloud.com',
  'mail.com'
];

/**
 * Generate a random name part (combination of name + random number)
 * @returns Random name string
 */
function generateRandomName(): string {
  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const num = Math.floor(Math.random() * 900) + 100; // 3 digit number
  return `${name}${num}`;
}

/**
 * Generate a random email address
 * @returns Random email address
 */
export function generateRandomEmail(): string {
  const namePart = generateRandomName();
  const domain = EMAIL_DOMAINS[Math.floor(Math.random() * EMAIL_DOMAINS.length)];
  return `${namePart}@${domain}`;
}

/**
 * Validate email format
 * @param email Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
