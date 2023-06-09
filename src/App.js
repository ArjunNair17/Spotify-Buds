import Main from "./screens/main/index"
import SignUpForm from "./screens/login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export default function App() {

    const [loggedIn, setLogin] = useState(false);


    useEffect(() => {
        const auth = getAuth();
        if(auth.currentUser) {
            console.log("user is logged in");
            setLogin(true)
        }
        else {
            console.log("user is not logged in");
            setLogin(false);
        }
    });
    

    console.log(loggedIn);
    

 return (
 <div>
    <Main></Main>
    

 </div>
 );
}
