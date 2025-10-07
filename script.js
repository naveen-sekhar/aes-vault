// Global variables
let currentUser = null;
let systemEncryptionKey = 'SecureVault2024'; // System-wide encryption key
let passwords = [];
let currentPasswordId = null;
let editingPasswordId = null;

// DOM elements
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const userInfo = document.getElementById('userInfo');
const userEmail = document.getElementById('userEmail');
const passwordsGrid = document.getElementById('passwordsGrid');
const emptyState = document.getElementById('emptyState');
const addPasswordModal = document.getElementById('addPasswordModal');
const viewPasswordModal = document.getElementById('viewPasswordModal');
const editPasswordModal = document.getElementById('editPasswordModal');
const passwordForm = document.getElementById('passwordForm');
const editPasswordForm = document.getElementById('editPasswordForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');

// Authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        userEmail.textContent = user.email;
        showDashboard();
        loadPasswords();
    } else {
        currentUser = null;
        showAuth();
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Set up form event listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    passwordForm.addEventListener('submit', handleAddPassword);
    editPasswordForm.addEventListener('submit', handleEditPassword);
    
    // Set up modal event listeners
    addPasswordModal.addEventListener('click', (e) => {
        if (e.target === addPasswordModal) {
            closeAddPasswordModal();
        }
    });
    
    viewPasswordModal.addEventListener('click', (e) => {
        if (e.target === viewPasswordModal) {
            closeViewPasswordModal();
        }
    });
    
    editPasswordModal.addEventListener('click', (e) => {
        if (e.target === editPasswordModal) {
            closeEditPasswordModal();
        }
    });
    
    // Set up real-time listener
    setupRealtimeListener();
    
    // Global error handling for unhandled errors
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
        showToast(`Application Error: ${e.error.message}`, 'error');
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        showToast(`Network Error: ${e.reason.message || 'Connection failed'}`, 'error');
    });
});

// Authentication functions
function toggleAuthMode() {
    const isLoginVisible = loginForm.style.display !== 'none';
    loginForm.style.display = isLoginVisible ? 'none' : 'block';
    registerForm.style.display = isLoginVisible ? 'block' : 'none';
    
    // Clear any error messages when switching forms
    hideErrorDisplay('loginErrorDisplay');
    hideErrorDisplay('registerErrorDisplay');
}

function showErrorDisplay(errorDisplayId, message) {
    const errorDisplay = document.getElementById(errorDisplayId);
    const errorMessage = document.getElementById(errorDisplayId.replace('Display', 'Message'));
    
    if (errorDisplay && errorMessage) {
        errorMessage.textContent = message;
        errorDisplay.style.display = 'flex';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            hideErrorDisplay(errorDisplayId);
        }, 10000);
    }
}

function hideErrorDisplay(errorDisplayId) {
    const errorDisplay = document.getElementById(errorDisplayId);
    if (errorDisplay) {
        errorDisplay.style.display = 'none';
    }
}

function showSuccessDisplay(formType, message) {
    // Create success display if it doesn't exist
    const form = document.getElementById(formType + 'Form');
    const existingSuccess = form.querySelector('.success-display');
    
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-display';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const h2 = form.querySelector('h2');
    h2.insertAdjacentElement('afterend', successDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

async function handleLogin(e) {
    e.preventDefault();
    
    // Clear previous errors
    hideErrorDisplay('loginErrorDisplay');
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showErrorDisplay('loginErrorDisplay', 'Please fill in all fields');
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Basic email validation
    if (!email.includes('@')) {
        showErrorDisplay('loginErrorDisplay', 'Please enter a valid email address');
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        console.log('Attempting login with email:', email);
        await auth.signInWithEmailAndPassword(email, password);
        showSuccessDisplay('login', 'Successfully signed in! Redirecting...');
        showToast('Successfully signed in!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // More specific error handling
        let errorMessage = '';
        let userFriendlyMessage = '';
        
        switch(error.code) {
            case 'auth/invalid-login-credentials':
                errorMessage = 'Invalid email or password. Please check your credentials.';
                userFriendlyMessage = '❌ Wrong email or password. Please double-check and try again.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email. Please sign up first.';
                userFriendlyMessage = '❌ Account not found. Click "Sign Up" to create a new account.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                userFriendlyMessage = '❌ Wrong password. Please check your password and try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                userFriendlyMessage = '❌ Please enter a valid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                userFriendlyMessage = '❌ Your account has been disabled. Contact support.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                userFriendlyMessage = '❌ Too many failed attempts. Wait a few minutes before trying again.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Check your internet connection.';
                userFriendlyMessage = '❌ Connection error. Please check your internet and try again.';
                break;
            default:
                errorMessage = `Login failed: ${error.message}`;
                userFriendlyMessage = `❌ Login failed: ${error.message}`;
        }
        
        // Show error on page AND in toast
        showErrorDisplay('loginErrorDisplay', userFriendlyMessage);
        showToast(errorMessage, 'error');
        
        // Also log detailed error for debugging
        console.error('Detailed error info:', {
            code: error.code,
            message: error.message,
            email: email,
            timestamp: new Date().toISOString()
        });
        
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    // Clear previous errors
    hideErrorDisplay('registerErrorDisplay');
    
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!email || !password) {
        showErrorDisplay('registerErrorDisplay', 'Please fill in all fields');
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Basic email validation
    if (!email.includes('@')) {
        showErrorDisplay('registerErrorDisplay', 'Please enter a valid email address');
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showErrorDisplay('registerErrorDisplay', 'Password must be at least 6 characters long');
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        console.log('Attempting registration with email:', email);
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        console.log('Registration successful! User ID:', userCredential.user.uid);
        
        showSuccessDisplay('register', '✅ Account created successfully! You can now sign in.');
        showToast('Account created successfully!', 'success');
        
        // Auto-switch to login form after successful registration
        setTimeout(() => {
            toggleAuthMode();
        }, 2000);
        
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // More specific error handling
        let errorMessage = '';
        let userFriendlyMessage = '';
        
        switch(error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists. Please sign in instead.';
                userFriendlyMessage = '❌ Email already registered. Click "Sign In" to login to your account.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address format.';
                userFriendlyMessage = '❌ Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please use at least 6 characters.';
                userFriendlyMessage = '❌ Password too weak. Use at least 6 characters with numbers and letters.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                userFriendlyMessage = '❌ Registration not available. Please contact support.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Network error. Check your internet connection.';
                userFriendlyMessage = '❌ Connection error. Please check your internet and try again.';
                break;
            default:
                errorMessage = `Registration failed: ${error.message}`;
                userFriendlyMessage = `❌ Registration failed: ${error.message}`;
        }
        
        // Show error on page AND in toast
        showErrorDisplay('registerErrorDisplay', userFriendlyMessage);
        showToast(errorMessage, 'error');
        
        // Log detailed error for debugging
        console.error('Detailed error info:', {
            code: error.code,
            message: error.message,
            email: email,
            timestamp: new Date().toISOString()
        });
        
    } finally {
        showLoading(false);
    }
}

async function logout() {
    try {
        await auth.signOut();
        passwords = [];
        showToast('Successfully signed out', 'info');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error signing out', 'error');
    }
}

// UI functions
function showAuth() {
    authSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    userInfo.style.display = 'none';
}

function showDashboard() {
    authSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    userInfo.style.display = 'flex';
}

function showLoading(show) {
    loadingOverlay.style.display = show ? 'block' : 'none';
}

function showToast(message, type = 'info') {
    console.log('showToast called with:', message, type);
    
    if (!toast) {
        console.error('Toast element not found!');
        return;
    }
    
    const toastContent = toast.querySelector('.toast-content');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    if (!toastIcon || !toastMessage) {
        console.error('Toast sub-elements not found!');
        return;
    }
    
    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    console.log('Toast should now be visible with class:', toast.className);
    
    setTimeout(() => {
        toast.classList.remove('show');
        console.log('Toast hidden');
    }, 3000);
}

// Encryption functions
function encryptPassword(password, key) {
    try {
        return CryptoJS.AES.encrypt(password, key).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt password');
    }
}

function decryptPassword(encryptedPassword, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt password');
    }
}

// Password management functions
function setupRealtimeListener() {
    // This will be called when user logs in
    auth.onAuthStateChanged((user) => {
        if (user && currentUser) {
            // Set up real-time listener for user's passwords (simplified query)
            db.collection('passwords')
                .where('userId', '==', user.uid)
                .onSnapshot((snapshot) => {
                    passwords = [];
                    snapshot.forEach(doc => {
                        passwords.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    
                    // Sort on client-side instead of server-side
                    passwords.sort((a, b) => {
                        const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
                        const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
                        return dateB - dateA; // Descending order (newest first)
                    });
                    
                    renderPasswords();
                }, (error) => {
                    console.error('Real-time listener error:', error);
                    showToast('Error syncing passwords', 'error');
                });
        }
    });
}

async function loadPasswords() {
    if (!currentUser) return;
    
    showLoading(true);
    
    try {
        // Simplified query without orderBy to avoid index requirement
        const snapshot = await db.collection('passwords')
            .where('userId', '==', currentUser.uid)
            .get();
        
        passwords = [];
        snapshot.forEach(doc => {
            passwords.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort on client-side
        passwords.sort((a, b) => {
            const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA; // Descending order (newest first)
        });
        
        renderPasswords();
    } catch (error) {
        console.error('Error loading passwords:', error);
        showToast('Error loading passwords', 'error');
    } finally {
        showLoading(false);
    }
}

function renderPasswords() {
    if (passwords.length === 0) {
        passwordsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    passwordsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    passwordsGrid.innerHTML = passwords.map(password => {
        const domain = extractDomain(password.websiteUrl || password.website);
        const strength = getPasswordStrength(password.password);
        
        return `
            <div class="password-card">
                <div class="password-card-header" onclick="viewPassword('${password.id}')" style="cursor: pointer;">
                    <div class="website-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <div class="password-card-info">
                        <h3>${escapeHtml(password.website)}</h3>
                        <p>${escapeHtml(password.username)}</p>
                    </div>
                </div>
                <div class="password-card-footer">
                    <span class="password-strength strength-${strength.level}">
                        ${strength.text}
                    </span>
                    <div class="card-actions">
                        <button class="btn-icon copy-btn" data-password-id="${password.id}" title="Copy Password">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon edit-btn" data-password-id="${password.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" data-password-id="${password.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners for action buttons after DOM update
    // Use immediate execution with requestAnimationFrame for better timing
    requestAnimationFrame(() => {
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                const passwordId = this.getAttribute('data-password-id');
                console.log('Copy button clicked for:', passwordId);
                copyPassword(passwordId);
            });
        });
        
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                const passwordId = this.getAttribute('data-password-id');
                console.log('Edit button clicked for:', passwordId);
                editPasswordById(passwordId);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                const passwordId = this.getAttribute('data-password-id');
                console.log('Delete button clicked for:', passwordId);
                deletePasswordConfirm(passwordId);
            });
        });
        
        console.log('Event listeners attached to', 
            document.querySelectorAll('.copy-btn').length, 'copy buttons,',
            document.querySelectorAll('.edit-btn').length, 'edit buttons,',
            document.querySelectorAll('.delete-btn').length, 'delete buttons'
        );
    });
}

function filterPasswords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredPasswords = passwords.filter(password => 
        password.website.toLowerCase().includes(searchTerm) ||
        password.username.toLowerCase().includes(searchTerm) ||
        (password.websiteUrl && password.websiteUrl.toLowerCase().includes(searchTerm)) ||
        (password.notes && password.notes.toLowerCase().includes(searchTerm))
    );
    
    if (filteredPasswords.length === 0 && searchTerm) {
        passwordsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No passwords found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        passwordsGrid.style.display = 'grid';
        emptyState.style.display = 'none';
    } else {
        // Temporarily replace passwords array for rendering
        const originalPasswords = passwords;
        passwords = filteredPasswords;
        renderPasswords();
        passwords = originalPasswords;
    }
}

// Modal functions
function showAddPasswordModal() {
    passwordForm.reset();
    addPasswordModal.style.display = 'block';
    document.getElementById('website').focus();
}

function closeAddPasswordModal() {
    addPasswordModal.style.display = 'none';
}

async function handleAddPassword(e) {
    e.preventDefault();
    
    const website = document.getElementById('website').value;
    const websiteUrl = document.getElementById('websiteUrl').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const notes = document.getElementById('notes').value;
    
    if (!website || !username || !password) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const encryptedPassword = encryptPassword(password, systemEncryptionKey);
        
        await db.collection('passwords').add({
            userId: currentUser.uid,
            website: website,
            websiteUrl: websiteUrl,
            username: username,
            password: encryptedPassword,
            notes: notes,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        closeAddPasswordModal();
        showToast('Password saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving password:', error);
        showToast('Error saving password', 'error');
    } finally {
        showLoading(false);
    }
}

function viewPassword(passwordId) {
    const password = passwords.find(p => p.id === passwordId);
    if (!password) return;
    
    currentPasswordId = passwordId;
    
    try {
        const decryptedPassword = decryptPassword(password.password, systemEncryptionKey);
        
        document.getElementById('viewWebsite').textContent = password.website;
        document.getElementById('websiteUrlText').textContent = password.websiteUrl || 'No URL provided';
        document.getElementById('usernameText').textContent = password.username;
        document.getElementById('passwordText').textContent = '••••••••';
        document.getElementById('passwordText').dataset.password = decryptedPassword;
        document.getElementById('viewNotes').textContent = password.notes || 'No notes';
        
        // Reset password visibility
        document.getElementById('toggleIcon').className = 'fas fa-eye';
        
        viewPasswordModal.style.display = 'block';
    } catch (error) {
        console.error('Error decrypting password:', error);
        showToast('Error decrypting password.', 'error');
    }
}

function closeViewPasswordModal() {
    viewPasswordModal.style.display = 'none';
    currentPasswordId = null;
}

function editPassword() {
    if (!currentPasswordId) return;
    
    const password = passwords.find(p => p.id === currentPasswordId);
    if (!password) return;
    
    try {
        const decryptedPassword = decryptPassword(password.password, systemEncryptionKey);
        
        // Fill edit form with current data
        document.getElementById('editWebsite').value = password.website;
        document.getElementById('editWebsiteUrl').value = password.websiteUrl || '';
        document.getElementById('editUsername').value = password.username;
        document.getElementById('editPassword').value = decryptedPassword;
        document.getElementById('editNotes').value = password.notes || '';
        
        editingPasswordId = currentPasswordId;
        closeViewPasswordModal();
        editPasswordModal.style.display = 'block';
    } catch (error) {
        console.error('Error decrypting password for edit:', error);
        showToast('Error loading password for edit', 'error');
    }
}

function handleCopyClick(event, passwordId) {
    // Prevent the card click event from firing
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    
    // Call copy function
    copyPassword(passwordId);
}

function handleEditClick(event, passwordId) {
    // Prevent any parent click events
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    // Call edit function directly
    editPasswordById(passwordId);
}

function handleDeleteClick(event, passwordId) {
    // Prevent any parent click events
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    
    // Call delete function
    deletePasswordConfirm(passwordId);
}

function editPasswordById(passwordId) {
    console.log('editPasswordById function called with:', passwordId);
    
    const password = passwords.find(p => p.id === passwordId);
    if (!password) {
        console.log('Password not found for ID:', passwordId);
        return;
    }
    
    try {
        const decryptedPassword = decryptPassword(password.password, systemEncryptionKey);
        
        // Fill edit form with current data
        document.getElementById('editWebsite').value = password.website;
        document.getElementById('editWebsiteUrl').value = password.websiteUrl || '';
        document.getElementById('editUsername').value = password.username;
        document.getElementById('editPassword').value = decryptedPassword;
        document.getElementById('editNotes').value = password.notes || '';
        
        editingPasswordId = passwordId;
        
        // Close view modal if it's open and open edit modal
        console.log('Closing view modal and opening edit modal');
        closeViewPasswordModal();
        editPasswordModal.style.display = 'block';
        console.log('Edit modal should now be visible');
        
    } catch (error) {
        console.error('Error decrypting password for edit:', error);
        showToast('Error loading password for edit', 'error');
    }
}

function closeEditPasswordModal() {
    editPasswordModal.style.display = 'none';
    editingPasswordId = null;
}

async function handleEditPassword(e) {
    e.preventDefault();
    
    if (!editingPasswordId) return;
    
    const website = document.getElementById('editWebsite').value;
    const websiteUrl = document.getElementById('editWebsiteUrl').value;
    const username = document.getElementById('editUsername').value;
    const password = document.getElementById('editPassword').value;
    const notes = document.getElementById('editNotes').value;
    
    if (!website || !username || !password) {
        showToast('Please fill in required fields', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const encryptedPassword = encryptPassword(password, systemEncryptionKey);
        
        await db.collection('passwords').doc(editingPasswordId).update({
            website: website,
            websiteUrl: websiteUrl,
            username: username,
            password: encryptedPassword,
            notes: notes,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        closeEditPasswordModal();
        showToast('Password updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating password:', error);
        showToast('Error updating password', 'error');
    } finally {
        showLoading(false);
    }
}

function toggleViewPassword() {
    const passwordText = document.getElementById('passwordText');
    const toggleIcon = document.getElementById('toggleIcon');
    const actualPassword = passwordText.dataset.password;
    
    if (passwordText.textContent === '••••••••') {
        passwordText.textContent = actualPassword;
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordText.textContent = '••••••••';
        toggleIcon.className = 'fas fa-eye';
    }
}

async function deletePassword() {
    if (!currentPasswordId) return;
    
    if (!confirm('Are you sure you want to delete this password?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        await db.collection('passwords').doc(currentPasswordId).delete();
        closeViewPasswordModal();
        showToast('Password deleted successfully', 'info');
    } catch (error) {
        console.error('Error deleting password:', error);
        showToast('Error deleting password', 'error');
    } finally {
        showLoading(false);
    }
}

async function copyPassword(passwordId) {
    console.log('copyPassword function called with:', passwordId);
    
    const password = passwords.find(p => p.id === passwordId);
    if (!password) {
        console.log('Password not found for ID:', passwordId);
        return;
    }
    
    try {
        const decryptedPassword = decryptPassword(password.password, systemEncryptionKey);
        await navigator.clipboard.writeText(decryptedPassword);
        console.log('Password copied successfully');
        showToast('Password copied to clipboard!', 'success');
    } catch (error) {
        console.error('Error copying password:', error);
        showToast('Error copying password', 'error');
    }
}

async function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = elementId === 'passwordText' ? 
        element.dataset.password || element.textContent : 
        element.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showToast('Error copying to clipboard', 'error');
    }
}

function deletePasswordConfirm(passwordId) {
    if (confirm('Are you sure you want to delete this password?')) {
        deletePasswordById(passwordId);
    }
}

async function deletePasswordById(passwordId) {
    showLoading(true);
    
    try {
        await db.collection('passwords').doc(passwordId).delete();
        showToast('Password deleted successfully', 'info');
    } catch (error) {
        console.error('Error deleting password:', error);
        showToast('Error deleting password', 'error');
    } finally {
        showLoading(false);
    }
}

// Utility functions
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function extractDomain(url) {
    try {
        return new URL(url.includes('://') ? url : `https://${url}`).hostname;
    } catch {
        return url;
    }
}

function generatePassword() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    
    // Ensure at least one character from each type
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    document.getElementById('password').value = password;
    showToast('Strong password generated!', 'success');
}

function generatePasswordForEdit() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    
    // Ensure at least one character from each type
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    document.getElementById('editPassword').value = password;
    showToast('Strong password generated!', 'success');
}

function getPasswordStrength(password) {
    if (!password) return { level: 'weak', text: 'Weak' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score >= 5) return { level: 'strong', text: 'Strong' };
    if (score >= 3) return { level: 'medium', text: 'Medium' };
    return { level: 'weak', text: 'Weak' };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email is already registered',
        'auth/weak-password': 'Password is too weak',
        'auth/invalid-email': 'Invalid email address',
        'auth/too-many-requests': 'Too many failed attempts. Try again later',
        'auth/network-request-failed': 'Network error. Check your connection'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}
