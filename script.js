// === Firebase SDK ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// === CONFIG ===
const firebaseConfig = {
  apiKey: "AIzaSyC3T8yH3nbrRnoiHkW_nLTOSEN2c3Izzbw",
  authDomain: "studyapp-ea619.firebaseapp.com",
  databaseURL: "https://studyapp-ea619-default-rtdb.firebaseio.com/",
  projectId: "studyapp-ea619",
  storageBucket: "studyapp-ea619.appspot.com",
  messagingSenderId: "163403718779",
  appId: "1:163403718779:web:23636dbda1f913db8942de"
};

// === Initialize Firebase ===
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// === Monitor Login State ===
onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.warn("No user logged in — redirecting...");
    setTimeout(() => {
      window.location.replace("index.html");
    }, 1500);
  } else {
    console.log("User logged in:", user.email);
    loadAssignments(user.uid);
  }
});

// === Save Assignment ===
window.saveAssignment = function () {
  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  const title = document.getElementById("taskTitle").value.trim();
  const details = document.getElementById("taskDetails").value.trim();

  if (!title) return alert("Please enter a title");

  const newRef = push(ref(db, "assignments/" + user.uid));
  set(newRef, {
    title,
    details,
    timestamp: new Date().toLocaleString()
  });

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDetails").value = "";
};

// === Load Assignments ===
function loadAssignments(uid) {
  const list = document.getElementById("assignmentsList");
  const userRef = ref(db, "assignments/" + uid);

  onValue(userRef, (snapshot) => {
    list.innerHTML = "";
    if (!snapshot.exists()) {
      list.innerHTML = "<p>Wala pang assignment 😊</p>";
      return;
    }

    snapshot.forEach((child) => {
      const data = child.val();
      list.innerHTML += `
        <div class="assignment">
          <p><strong>${data.title}</strong></p>
          <p>${data.details || ""}</p>
          <small style="color:gray;">🕒 ${data.timestamp}</small>
        </div>
      `;
    });
  });
}

// === Logout ===
window.logout = function () {
  signOut(auth).then(() => {
    window.location.replace("index.html");
  });
};
