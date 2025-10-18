// Import the functions you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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


// Signup function
window.signUp = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("✅ Account created successfully!");
      console.log(userCredential.user);
    })
    .catch((error) => {
      alert("❌ " + error.message);
    });
};

// Login function
window.login = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("✅ Logged in successfully!");
      window.location.href = "dashboard.html"; // redirect after login
    })
    .catch((error) => {
      alert("❌ " + error.message);
    });
};
