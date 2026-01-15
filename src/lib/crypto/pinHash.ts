// Generate a random salt
export function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Hash a PIN with salt using SHA-256
export async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Verify a PIN against stored hash
export async function verifyPin(
  inputPin: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  const inputHash = await hashPin(inputPin, salt);
  return inputHash === storedHash;
}

// Validate PIN format (4 digits)
export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}
