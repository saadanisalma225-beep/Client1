import CryptoJS from 'crypto-js';

const SECRET_KEY = 'bazart-secret-key-2026';

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (encryptedData) => {
  try {
    // Check if data looks like encrypted data (starts with U2FsdGVkX1 for AES)
    if (!encryptedData || typeof encryptedData !== 'string') {
      return null;
    }
    
    // Try to decrypt
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    // If decryption failed, return null
    if (!decryptedString) {
      return null;
    }
    
    return JSON.parse(decryptedString);
  } catch (error) {
    // If it's not encrypted data (old plain JSON), try parsing directly
    try {
      return JSON.parse(encryptedData);
    } catch {
      return null;
    }
  }
};