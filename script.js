// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3T8yH3nbrRnoiHkW_nLTOSEN2c3Izzbw",
  authDomain: "studyapp-ea619.firebaseapp.com",
  projectId: "studyapp-ea619",
  storageBucket: "studyapp-ea619.firebasestorage.app",
  messagingSenderId: "163403718779",
  appId: "1:163403718779:web:23636dbda1f913db8942de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create account
window.createAccount = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("✅ Account created successfully!");
      window.location.href = "dashboard.html";
    })
    .catch(error => alert("❌ " + error.message));
}

// Login
window.login = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("✅ Login successful!");
      window.location.href = "dashboard.html";
    })
    .catch(error => alert("❌ " + error.message));
}
