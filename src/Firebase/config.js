import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDX1CXAtkqj9Tg1HVYwlcocpkMxB-Y4NTw",
  authDomain: "spotifybuds-e7e29.firebaseapp.com",
  databaseURL: "https://spotifybuds-e7e29-default-rtdb.firebaseio.com",
  projectId: "spotifybuds-e7e29",
  storageBucket: "spotifybuds-e7e29.appspot.com",
  messagingSenderId: "566960468786",
  appId: "1:566960468786:web:cb73617f63fc5f79e45d2b",
  measurementId: "G-N3X3577Z70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };