import crypto from 'crypto';

export const hash = async (pin: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // In a real application, use a proper password hashing library like bcrypt
    // This is a simple example using SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(pin);
    resolve(hash.digest('hex'));
  });
};

export const verify = async (pin: string, hashedPin: string): Promise<boolean> => {
  const inputHash = await hash(pin);
  return inputHash === hashedPin;
};