import crypto from 'crypto';

// Function to generate a secure random string
function generateSecureSecret(length = 64) {
  return crypto
    .randomBytes(length)
    .toString('base64')
    .replace(/[+/]/g, '') // Remove + and / characters
    .slice(0, length); // Ensure exact length
}

// Generate the secret
const jwtSecret = generateSecureSecret();

console.log('Generated JWT Secret:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('\nCopy this value to your .env file'); 