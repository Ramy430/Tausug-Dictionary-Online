// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAJL6Ctsm6RpO53zCMJMEFWyL0Dxfzer3c",
  authDomain: "tausug-dictionary.firebaseapp.com",
  projectId: "tausug-dictionary",
  storageBucket: "tausug-dictionary.appspot.com",
  messagingSenderId: "709425271776",
  appId: "1:709425271776:web:dd63ac94942dcad6b81185"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const inputText = document.getElementById('inputText');
const processBtn = document.getElementById('processBtn');
const wordsContainer = document.getElementById('wordsContainer');
const saveJsonBtn = document.getElementById('saveJsonBtn');
const notification = document.getElementById('notification');
const languageSelect = document.getElementById('languageSelect');

let analyzedWords = [];

function showNotification(message, isError=false) {
    notification.textContent = message;
    notification.className = isError ? 'notification error show' : 'notification show';
    setTimeout(() => { notification.className = 'notification'; }, 3000);
}

// Split sentence into words
processBtn.addEventListener('click', () => {
    const sentence = inputText.value.trim();
    if (!sentence) { showNotification('Enter a sentence!', true); return; }

    wordsContainer.innerHTML = '';
    analyzedWords = [];

    const words = sentence.split(/\s+|(?=[.,!?;:])|(?<=[.,!?;:])/).filter(w => w.trim() !== '');
    words.forEach(word => {
        const cleanWord = word.replace(/[.,!?;:"]/g,'').toLowerCase();
        const wordBox = document.createElement('div');
        wordBox.className = 'word-box';
        wordBox.innerHTML = `<div class="word">${word}</div>
                             <input class="translation-input" placeholder="Enter translation..." value="">`;
        wordsContainer.appendChild(wordBox);
        analyzedWords.push({ original: word, clean: cleanWord, translation: '', language: languageSelect.value });
    });

    showNotification(`Split ${words.length} words`);
});

// Save to Firestore
saveJsonBtn.addEventListener('click', async () => {
    if (analyzedWords.length === 0) { showNotification('No words to save!', true); return; }
    try {
        await addDoc(collection(db, "wordsAnalysis"), {
            originalSentence: inputText.value,
            words: analyzedWords,
            language: languageSelect.value,
            timestamp: new Date()
        });
        showNotification('Saved to Firestore successfully!');
    } catch (error) {
        showNotification('Error saving to Firestore!', true);
        console.error(error);
    }
});
