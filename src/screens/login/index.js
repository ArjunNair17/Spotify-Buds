import React, { useState } from "react";


import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './login.css';
const clientID = "4db376ff1b0941de8908d1748f1eb266";
const redirectURL = "http://localhost:3000/main";


export default function SignUpForm( {callback}) {

    async function redirectToAuthCodeFlow(clientId) {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);
    
        localStorage.setItem("verifier", verifier);
    
        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("response_type", "code");
        params.append("redirect_uri", redirectURL);
        params.append("scope", "user-read-private user-read-email user-read-currently-playing user-read-recently-played user-top-read");
        params.append("code_challenge_method", "S256");
        params.append("code_challenge", challenge);
    
        document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
      }
    
      function generateCodeVerifier(length) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }
    
      async function generateCodeChallenge(codeVerifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      }

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const handleLogIn = (event) => {
        event.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, pwd).then((userCredential) =>{ redirectToAuthCodeFlow(clientID); localStorage.setItem("loggedIn", "true");}).catch((error) => {callback(false);alert(error.message)});
        setEmail("");
        setPwd("");
    }

    const handleSignUp = (event) => {
        event.preventDefault();
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, pwd).then((userCredential) => alert(userCredential.user)).catch((error) => {alert(error.message)});
        setEmail("");
        setPwd("");        
    }
    return (
        <div className="RestofPage">
        <div className="container">
            <h1>SpotifyBuds</h1>
            <form height="100px">
                <input type="email" placeholder="Username" value={email} className="signupbar" onChange={(event) => setEmail(event.target.value)}></input>
                
                <input type="password" placeholder="Password" value={pwd} className="signupbar" onChange={(event) => setPwd(event.target.value)}></input>
                <button className="button" onClick = {(event) => handleSignUp(event)}>Sign Up</button>{" "}
                
                <button className="button2" onClick= {(event) => handleLogIn(event)}>Log In</button>
            </form>
        </div>
        <div className="RestofPage">
        
      </div>
        </div>
    );
}
