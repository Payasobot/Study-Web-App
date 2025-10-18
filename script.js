// === Firebase Setup ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3T8yH3nbrRnoiHkW_nLTOSEN2c3Izzbw",
  authDomain: "studyapp-ea619.firebaseapp.com",
  projectId: "studyapp-ea619",
  storageBucket: "studyapp-ea619.appspot.com",
  messagingSenderId: "163403718779",
  appId: "1:163403718779:web:23636dbda1f913db8942de",
  databaseURL: "https://studyapp-ea619-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// === Check if user logged in ===
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html"; // logout redirect only
  } else {
    loadAssignments(user.uid);
  }
});

// === Save Assignment ===
function saveAssignment() {
  const user = auth.currentUser;
  if (!user) return alert("Please login first!");

  const title = document.getElementById("taskTitle").value.trim();
  const details = document.getElementById("taskDetails").value.trim();

  if (!title) return alert("Please enter a title");

  const newRef = push(ref(db, "assignments/" + user.uid));
  set(newRef, {
    title: title,
    details: details,
    timestamp: new Date().toLocaleString()
  });

  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDetails").value = "";
}

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
          <p style="color:gray;font-size:12px;">🕒 ${data.timestamp}</p>
        </div>
      `;
    });
  });
}

// === Logout ===
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};
