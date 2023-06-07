import React, { useState, useContext } from "react";

import { FirebaseContext } from "./context/FirebaseContext";
import { app } from "./Firebase/config";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom";
import './SignUpForm.css';

export default function SignUpForm() {

    

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const history = useHistory();
    const handleLogIn = (event) => {
        event.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, pwd).then((userCredential) => history.push("/main")).catch((error) => {alert(error.message)});
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
            <form>
                <input type="email" placeholder="Username" value={email} className="signupbar" onChange={(event) => setEmail(event.target.value)}></input>
                
                <input type="password" placeholder="Password" value={pwd} className="signupbar" onChange={(event) => setPwd(event.target.value)}></input>
                <button className="button" onClick = {(event) => handleSignUp(event)}>Sign Up</button>{" "}
                
                <button className="button" onClick= {(event) => handleLogIn(event)}>Log In</button>
            </form>
        </div>
        <div className="RestofPage">
        
      </div>
        </div>
    );
}

