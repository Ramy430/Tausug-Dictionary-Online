// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJL6Ctsm6RpO53zCMJMEFWyL0Dxfzer3c",
  authDomain: "tausug-dictionary.firebaseapp.com",
  projectId: "tausug-dictionary",
  storageBucket: "tausug-dictionary.appspot.com",
  messagingSenderId: "709425271776",
  appId: "1:709425271776:web:dd63ac94942dcad6b81185"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const tausugInput = document.getElementById("tausugWord");
const englishInput = document.getElementById("englishMeaning");
const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");

// Save button click
saveBtn.addEventListener("click", async () => {
  const tausugWord = tausugInput.value.trim();
  const englishMeaning = englishInput.value.trim();

  if (!tausugWord || !englishMeaning) {
    status.textContent = "Please fill in both fields.";
    status.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "dictionary"), {
      tausug: tausugWord,
      english: englishMeaning,
      timestamp: new Date()
    });
    status.textContent = "Saved successfully!";
    status.style.color = "green";
    tausugInput.value = "";
    englishInput.value = "";
  } catch (error) {
    status.textContent = "Error saving: " + error.message;
    status.style.color = "red";
  }
});
