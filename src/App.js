import Main from "./screens/main/index"
import SignUpForm from "./screens/login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export default function App() {

    const [loggedIn, setLogin] = useState(false);
    // const auth = getAuth();
    // auth.onAuthStateChanged((user) => {
    //     if(user) {
    //         setLogin(true);
    //     }
    //     else {
    //         setLogin(false);
    //     }
    // })
    useEffect(() => {
        if(localStorage.getItem("loggedIn") === "true") {
            console.log("successful");
            return;
        }
        else {

            localStorage.setItem("loggedIn", "false");
        }

    }, []);


 return (
 <div>
    {localStorage.getItem("loggedIn") === "true" ?  null: <SignUpForm callback={setLogin}></SignUpForm>}
    <Main></Main>

 </div>
 );
}
