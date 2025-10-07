# AES Encryption - Important Code Lines

## Line 2 (script.js):
```javascript
let systemEncryptionKey = 'SecureVault2024'; // System-wide encryption key
```
**Explanation:** This is the master encryption key used throughout the application. It's a 15-character string that serves as the foundation for all AES encryption operations in the system.

## Line 5 (aes-test.html):
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
```
**Explanation:** This imports the CryptoJS library (version 4.1.1) which provides the AES encryption/decryption functionality. This is the core cryptographic library that enables AES-256 encryption.

## Lines 153-159 (aes-test.html):
```html
<tr><td>Algorithm</td><td>AES-256</td></tr>
<tr><td>Mode</td><td>CBC (Cipher Block Chaining)</td></tr>
<tr><td>Padding</td><td>PKCS#7</td></tr>
<tr><td>Key Size</td><td>256 bits (32 bytes)</td></tr>
<tr><td>IV Size</td><td>128 bits (16 bytes)</td></tr>
```
**Explanation:** This table defines the AES encryption specifications used in the application: AES-256 algorithm with CBC mode, PKCS#7 padding, 256-bit key size, and 128-bit initialization vector size.

## Lines 225-235 (aes-test.html):
```javascript
// Same configuration as your SecureVault project
const systemEncryptionKey = 'SecureVault2024';

// Encryption function (same as your project)
function encryptPassword(password, key) {
    try {
        return CryptoJS.AES.encrypt(password, key).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt password');
    }
}
```
**Explanation:** This is the core AES encryption function that takes a password and encryption key, then uses CryptoJS.AES.encrypt() to encrypt the password. It returns the encrypted result as a string and includes error handling.

## Lines 237-246 (aes-test.html):
```javascript
// Decryption function (same as your project)
function decryptPassword(encryptedPassword, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt password');
    }
}
```
**Explanation:** This is the core AES decryption function that takes an encrypted password and key, uses CryptoJS.AES.decrypt() to decrypt it, then converts the result back to UTF-8 string format. Includes comprehensive error handling.

## Lines 360-366 (script.js):
```javascript
// Encryption functions
function encryptPassword(password, key) {
    try {
        return CryptoJS.AES.encrypt(password, key).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt password');
    }
}
```
**Explanation:** Duplicate of the main encryption function in the primary script file. This function is called whenever a password needs to be encrypted before storage in Firebase.

## Lines 368-375 (script.js):
```javascript
function decryptPassword(encryptedPassword, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt password');
    }
}
```
**Explanation:** Duplicate of the main decryption function in the primary script file. This function is called whenever an encrypted password needs to be decrypted for display or copying.

## Line 639 (script.js):
```javascript
const encryptedPassword = encryptPassword(password, systemEncryptionKey);
```
**Explanation:** This line demonstrates the actual usage of encryption when adding a new password. The plain text password is encrypted using the system encryption key before being stored in the database.

## Line 644 (script.js):
```javascript
password: encryptedPassword,
```
**Explanation:** This shows how the encrypted password is stored in the Firebase database. Only the encrypted version is transmitted and stored, never the plain text password.

## Line 662 (script.js):
```javascript
const decryptedPassword = decryptPassword(password.password, systemEncryptionKey);
```
**Explanation:** This line shows how passwords are decrypted when viewing password details. The encrypted password from the database is decrypted using the system key for display.

## Line 700 (script.js):
```javascript
const decryptedPassword = decryptPassword(password.password, systemEncryptionKey);
```
**Explanation:** Another instance where decryption occurs, this time when editing a password. The stored encrypted password is decrypted to populate the edit form.

## Line 789 (script.js):
```javascript
const encryptedPassword = encryptPassword(password, systemEncryptionKey);
```
**Explanation:** This shows encryption during password updates. When editing a password, the new plain text password is encrypted before updating the database record.

## Line 794 (script.js):
```javascript
password: encryptedPassword,
```
**Explanation:** The encrypted password replaces the old encrypted password in the database during updates, maintaining security throughout the password lifecycle.

## Line 845 (script.js):
```javascript
const decryptedPassword = decryptPassword(password.password, systemEncryptionKey);
```
**Explanation:** This decryption occurs when copying a password to clipboard. The encrypted password is temporarily decrypted to copy the actual password value to the user's clipboard.

## Lines 258-273 (aes-test.html):
```javascript
try {
    const encrypted = encryptPassword(plainText, systemEncryptionKey);
    showResult(resultDiv, `<strong>Encrypted Result:</strong><br>${encrypted}`);
} catch (error) {
    showResult(resultDiv, `<strong>Encryption Error:</strong> ${error.message}`, true);
}
```
**Explanation:** This code block in the test file demonstrates how encryption is performed with user input, showing the encrypted result and handling any encryption errors that might occur.

## Lines 285-293 (aes-test.html):
```javascript
try {
    const decrypted = decryptPassword(encryptedText, systemEncryptionKey);
    if (!decrypted) {
        showResult(resultDiv, 'Decryption failed - invalid encrypted data or wrong key', true);
    } else {
        showResult(resultDiv, `<strong>Decrypted Result:</strong><br>${decrypted}`);
    }
} catch (error) {
```
**Explanation:** This demonstrates the decryption process in the test interface, including validation of decryption results and comprehensive error handling for invalid encrypted data or wrong keys.

## Security Implementation Summary:
The application implements AES-256 encryption with the following security measures:
- **Client-side encryption**: All passwords are encrypted before transmission
- **Consistent key usage**: Same system key used throughout the application
- **Error handling**: Comprehensive try-catch blocks for encryption/decryption operations
- **No plain text storage**: Only encrypted passwords are stored in Firebase
- **Real-time security**: Encryption/decryption happens seamlessly during all CRUD operations