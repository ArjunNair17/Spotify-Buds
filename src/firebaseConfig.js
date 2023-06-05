import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

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

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default db;