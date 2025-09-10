// Firebase configuration
// TODO: Replace with your actual Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBYHes5Am9gp_c95-nBpdGCDywOWUqZ0Kk",
  authDomain: "vault-1546.firebaseapp.com",
  projectId: "vault-1546",
  storageBucket: "vault-1546.firebasestorage.app",
  messagingSenderId: "306139311845",
  appId: "1:306139311845:web:79eb3006034a22f64cae0c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.auth = auth;
window.db = db;

// Optional: Enable Firestore offline persistence
db.enablePersistence().catch((err) => {
    if (err.code == 'failed-precondition') {
        console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
        console.log('The current browser does not support persistence.');
    }
});
