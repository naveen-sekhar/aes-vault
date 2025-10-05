# 🔐 AES-Vault - Secure Password Manager

A modern password manager web application with **AES-256 encryption** and Firebase backend for secure password storage and management.

## 🌟 Features

- **🔒 Secure Authentication**: Firebase Authentication for user management
- **⚡ Real-time Sync**: Live updates across all devices using Firebase real-time listeners
- **🛡️ Client-Side Encryption**: AES-256 encryption using CryptoJS - passwords are encrypted before leaving your device
- **🎨 Modern UI**: Clean, responsive design with gradient backgrounds and smooth animations
- **📝 Password Management**: Add, view, edit, search, and delete passwords securely
- **🔑 Password Generator**: Built-in strong password generator with customizable options
- **📊 Password Strength**: Visual indicators for password strength
- **📋 Copy to Clipboard**: One-click password copying
- **🌐 Website Integration**: Store both website names and URLs for easy access

## 🔐 Security Features

- **AES-256 Encryption**: Military-grade encryption using 256-bit keys
- **System Encryption Key**: Uses secure system-wide encryption key (`SecureVault2024`)
- **Client-Side Encryption**: All passwords are encrypted on your device before being sent to Firebase
- **Secure Storage**: Only encrypted data is stored in the cloud
- **No Plain Text**: Passwords are never stored in plain text anywhere
- **PBKDF2 Key Derivation**: Uses 1000 iterations with random salt for enhanced security

## ⚡ Real-time Features

- **Live Updates**: Changes are instantly synced across all your devices
- **Real-time Notifications**: Get immediate feedback on all operations
- **Automatic Refresh**: Password list updates automatically when changes are made
- **Seamless Experience**: No need to manually refresh - everything happens in real-time

## 🗂️ Project Structure

```
aes-vault/
├── 📄 index.html           # Main application - Complete UI with auth, dashboard, modals
├── 🎨 styles.css          # Modern CSS with responsive design, animations, and gradients
├── ⚙️ script.js           # Core application logic, AES encryption/decryption, Firebase integration
├── 🔧 firebase-config.js  # Firebase configuration and initialization
├── 🧪 aes-test.html       # Standalone AES encryption/decryption testing tool
├── 📖 README.md           # Project documentation
├── 📁 .git/               # Git version control
└── 📋 .gitattributes      # Git configuration for line endings
```

### 📁 File Descriptions

| File | Purpose | Key Features |
|------|---------|--------------|
| **index.html** | Main application interface | Authentication forms, password dashboard, modals, complete UI structure |
| **styles.css** | Styling and layout | Responsive design, modern gradients, animations, modal styles |
| **script.js** | Application logic | AES encryption/decryption, Firebase operations, user management, real-time sync |
| **firebase-config.js** | Firebase setup | Configuration, authentication, Firestore initialization |
| **aes-test.html** | Testing tool | Standalone encryption/decryption tester with same AES configuration |

## 🔧 Cryptographic Specifications

| Parameter | Value | Description |
|-----------|--------|-------------|
| **Algorithm** | AES-256 | Advanced Encryption Standard with 256-bit key |
| **Mode** | CBC | Cipher Block Chaining mode |
| **Padding** | PKCS#7 | Standard padding scheme |
| **Key Derivation** | PBKDF2 | Password-Based Key Derivation Function 2 |
| **Iterations** | 1000 | PBKDF2 iterations for key stretching |
| **Salt** | 64-bit | Random salt for each encryption |
| **IV** | 128-bit | Random Initialization Vector |
| **Output Format** | Base64 | OpenSSL compatible format |

## 🚀 Quick Start

### 📋 Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for Firebase and CDN resources
- Local web server (optional but recommended for development)

### 🏃‍♂️ Running the Application

#### Option 1: Direct File Access
1. **Clone/Download** the repository
2. **Open** `index.html` directly in your web browser
3. **Start using** the application immediately!

#### Option 2: Local Web Server (Recommended)
```bash
# Navigate to project directory
cd aes-vault

# Using Python 3
python -m http.server 8000

# Using Python 2
python -M SimpleHTTPServer 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then open: **http://localhost:8000**

#### Option 3: Online Hosting
Deploy to any static hosting service:
- **GitHub Pages**: Push to GitHub and enable Pages
- **Netlify**: Drag & drop the folder
- **Vercel**: Connect your GitHub repository
- **Firebase Hosting**: Use Firebase CLI to deploy

### 🧪 Testing AES Encryption

For testing the encryption/decryption functionality separately:

1. **Open** `aes-test.html` in your browser
2. **Use** the standalone testing tool to:
   - Encrypt any text using your system's AES configuration
   - Decrypt encrypted strings
   - Verify the encryption implementation

## ⚙️ Setup Instructions

### 1. 🔥 Firebase Configuration

The project comes pre-configured with a Firebase project, but you can set up your own:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** and **Firestore Database**
4. Get your Firebase configuration from **Project Settings**
5. Replace the configuration in `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

**Current Configuration**: Pre-configured with `vault-1546` project for immediate use.

### 2. Firebase Authentication Setup

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Optionally configure authorized domains for production

### 3. Firestore Database Setup

1. In Firebase Console, go to Firestore Database
2. Create database in production mode or test mode
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /passwords/{document} {
      allow read, write, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. 🎯 Local Development Setup

1. **Clone/Download** the project files
2. **Navigate** to the project directory
3. **Choose your preferred method**:

```bash
# Method 1: Python HTTP Server
cd aes-vault
python -m http.server 8000
# Open: http://localhost:8000

# Method 2: Node.js serve
npx serve . -p 8000
# Open: http://localhost:8000

# Method 3: PHP Server
php -S localhost:8000
# Open: http://localhost:8000

# Method 4: VS Code Live Server
# Install Live Server extension
# Right-click index.html → "Open with Live Server"
```

## 🌐 Accessing the Application

### 🏠 Main Application
- **URL**: `http://localhost:8000/index.html` or `http://localhost:8000/`
- **Purpose**: Full password manager with authentication
- **Features**: Login, register, password management, real-time sync

### 🧪 AES Testing Tool
- **URL**: `http://localhost:8000/aes-test.html`
- **Purpose**: Standalone encryption/decryption testing
- **Features**: Encrypt/decrypt text, verify AES implementation

## 📱 Usage Guide

### 🔐 First Time Setup

1. **Open** the application in your web browser
2. **Click** "Sign Up" to create a new account
3. **Enter** your email and password
4. **Start** adding your passwords immediately!

### ➕ Adding Passwords

1. After login, **click** "Add Password" button
2. **Fill in** the required information:
   - Website/Application name (required)
   - Website URL (optional)
   - Username (required)
   - Password (required)
   - Notes (optional)
3. **Use** the password generator for strong passwords
4. Password is **automatically encrypted** and saved

### 🔧 Managing Passwords

| Action | How To | Description |
|--------|--------|-------------|
| **👀 View** | Click on password card | View all details including hidden password |
| **✏️ Edit** | Click edit button | Modify any password information |
| **📋 Copy** | Click copy buttons | Copy username, password, or URL to clipboard |
| **❌ Delete** | Click delete button | Remove password with confirmation |
| **🔍 Search** | Use search bar | Filter passwords instantly as you type |

### ⚡ Real-time Features

- **Instant Sync**: Changes appear immediately across all devices
- **Live Search**: Results update as you type
- **Auto-refresh**: No manual refresh needed
- **Immediate Feedback**: Toast notifications for all actions

## Usage

### First Time Setup

1. Open the application in your web browser
2. Click "Sign Up" to create a new account
3. Enter your email and password (no master password required)
4. Start adding your passwords immediately!

### Adding Passwords

1. After login, click "Add Password"
2. Fill in website/application name, optional URL, username, password, and notes
3. Use the password generator for strong passwords
4. Password is automatically encrypted and saved in real-time

### Managing Passwords

1. **View**: Click on any password card to view details
2. **Edit**: Click the edit button or use "Edit" in the detailed view
3. **Copy**: Use copy buttons to copy username, password, or URL
4. **Delete**: Click delete button with confirmation
5. **Search**: Use the search bar to filter passwords instantly

### Real-time Features

- Changes are instantly visible across all logged-in devices
- No need to refresh - updates happen automatically
- Live search results as you type
- Immediate feedback on all operations

## Security Architecture

1. **User Registration/Login**: Firebase handles authentication
2. **Password Storage**: User enters password details
3. **Encryption**: Password is encrypted with system key using AES-256
4. **Cloud Storage**: Only encrypted password is stored in Firestore
5. **Retrieval**: Encrypted passwords are downloaded and decrypted locally
6. **Real-time Sync**: Changes are synced across devices in real-time

## 🛠️ Technologies Used

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | Latest | Core web technologies |
| **Authentication** | Firebase Auth | 9.23.0 | User management and authentication |
| **Database** | Firebase Firestore | 9.23.0 | Real-time NoSQL database |
| **Encryption** | CryptoJS | 4.1.1 | AES-256 encryption/decryption |
| **Icons** | Font Awesome | 6.0.0 | UI icons and visual elements |
| **Fonts** | Google Fonts (Inter) | Latest | Modern typography |
| **Styling** | CSS Grid, Flexbox | Native | Responsive layout system |

## 🔒 Security Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │    │   AES-256-CBC    │    │   Firebase      │
│  (Plain Text)   │───▶│   Encryption     │───▶│   Firestore     │
│                 │    │  + PBKDF2 + Salt │    │ (Encrypted Only)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐
│   User Display  │◀───│   AES-256-CBC    │
│  (Plain Text)   │    │   Decryption     │
└─────────────────┘    └──────────────────┘
```

### 🔐 Encryption Flow
1. **User Input**: User enters password in browser
2. **Client-Side Encryption**: AES-256 encryption happens in browser
3. **Secure Transmission**: Only encrypted data sent to Firebase
4. **Cloud Storage**: Encrypted data stored in Firestore
5. **Secure Retrieval**: Encrypted data retrieved from cloud
6. **Client-Side Decryption**: Decryption happens in browser only when needed

## 🚨 Security Considerations

### ✅ Current Security Features
- **AES-256 encryption** with CBC mode
- **PBKDF2 key derivation** with 1000 iterations
- **Random salt and IV** for each encryption
- **Client-side encryption** - server never sees plain text
- **Firebase security rules** - users can only access their own data

### ⚠️ Security Recommendations
- **Key Management**: Consider user-specific encryption keys
- **Iterations**: Increase PBKDF2 iterations to 10,000+ for better security
- **HTTPS**: Always use HTTPS in production
- **Backup**: Implement secure backup mechanisms
- **Audit**: Regular security audits recommended

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the existing issues on GitHub
2. **Create** a new issue with detailed description
3. **Include** browser version, error messages, and steps to reproduce

## 🎯 Future Enhancements

- [ ] **Multi-factor Authentication** (2FA)
- [ ] **Password strength analyzer**
- [ ] **Secure password sharing**
- [ ] **Import/Export functionality**
- [ ] **Mobile app development**
- [ ] **Biometric authentication**
- [ ] **Advanced search and filtering**
- [ ] **Password history tracking**

---

**⚡ Ready to secure your passwords? Start by opening `index.html` in your browser!**
