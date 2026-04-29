import CryptoJS from 'crypto-js';

const SECRET_KEY = 'quickmart-aes-super-secret-key-2026';

export const encryptData = (data) => {
  if (!data) return data;
  try {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

export const decryptData = (ciphertext) => {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    // Try to parse as JSON, if it fails, return the string
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
