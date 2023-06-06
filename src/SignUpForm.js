import React, { useState, useContext } from "react";

import { FirebaseContext } from "./context/FirebaseContext";
import { app } from "./Firebase/config";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom";

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
        <div className="signupbar">
            <form>
                <label>Email</label>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)}></input>
                <label>Password</label>
                <input type="password" value={pwd} onChange={(event) => setPwd(event.target.value)}></input>
                <button onClick = {(event) => handleSignUp(event)}>Sign Up</button>
                <button onClick= {(event) => handleLogIn(event)}>Log In</button>
            </form>
        </div>
    );
}