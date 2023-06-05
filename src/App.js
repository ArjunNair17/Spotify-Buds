import logo from './logo.svg';
import './App.css';
import SignUpForm from './SignUpForm';
import NavigationBar from './NavigationBar';
import { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MainComponent from './SpotifyPage';

function App() {
  
  const [userId, setUserId] = useState("");

  return (
    <Router>
      <NavigationBar></NavigationBar>
      <Switch>
        <Route exact path="/">
          <div className="App">
            <SignUpForm></SignUpForm>
          </div>
        </Route>
        <Route path="/profile">
          <h1>Welcome!</h1>
        </Route>
        <Route path="/main">
          <div className="MainPage">
            <MainComponent/>
          </div>
        </Route>
      </Switch>

    </Router>

  );
}

export default App;
