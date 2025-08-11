require('dotenv').config();
const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // 16 bytes for AES-CBC

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(process.env.CRYPTO_SECRET, 'hex'); // must be 32 bytes for aes-256

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}

function decrypt({ iv, encryptedData }) {
    const key = Buffer.from(process.env.CRYPTO_SECRET, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const encryptedText = Buffer.from(encryptedData, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = { encrypt, decrypt };