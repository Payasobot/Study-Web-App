import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔥 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC3T8yH3nbrRnoiHkW_nLTOSEN2c3Izzbw",
  authDomain: "studyapp-ea619.firebaseapp.com",
  projectId: "studyapp-ea619",
  storageBucket: "studyapp-ea619.firebasestorage.app",
  messagingSenderId: "163403718779",
  appId: "1:163403718779:web:23636dbda1f913db8942de"
};


// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔒 Check if user logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    const uid = user.uid;
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      renderList("assignmentList", data.assignments || []);
      renderList("reminderList", data.reminders || []);
      renderList("diaryList", data.diary || []);
    } else {
      await setDoc(userRef, { assignments: [], reminders: [], diary: [] });
    }
  }
});

// 🔄 UI elements
const logoutBtn = document.getElementById("logoutBtn");
const toggleModeBtn = document.getElementById("toggleMode");
const body = document.body;

// Dark mode default
body.classList.add("dark-mode");
toggleModeBtn.textContent = "☀️";

// 🌓 Toggle dark/light mode
toggleModeBtn.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  const isLight = body.classList.contains("light-mode");
  toggleModeBtn.textContent = isLight ? "🌙" : "☀️";
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// Add assignments/reminders/diary
document.getElementById("addAssignment").addEventListener("click", () => addItem("assignments", "assignmentInput", "assignmentList"));
document.getElementById("addReminder").addEventListener("click", () => addItem("reminders", "reminderInput", "reminderList"));
document.getElementById("saveDiary").addEventListener("click", () => addItem("diary", "diaryInput", "diaryList"));

// Add item to Firestore
async function addItem(type, inputId, listId) {
  const user = auth.currentUser;
  if (!user) return;

  const input = document.getElementById(inputId);
  const text = input.value.trim();
  if (text === "") return;

  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);
  const data = docSnap.data() || {};
  const items = data[type] || [];
  items.push(text);

  await updateDoc(userRef, { [type]: items });
  input.value = "";
  renderList(listId, items);
}

// Render list
function renderList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.addEventListener("click", () => deleteItem(listId, index));
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Delete item
async function deleteItem(listId, index) {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const field = listId.replace("List", "");
  const docSnap = await getDoc(userRef);
  const data = docSnap.data();
  const items = data[field];
  items.splice(index, 1);
  await updateDoc(userRef, { [field]: items });
  renderList(listId, items);
}
