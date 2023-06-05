import logo from './logo.svg';
import './App.css';
import SignUpForm from './SignUpForm';
import NavigationBar from './NavigationBar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import MainComponent from './bruh';


function App() {
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
          <div className="Main Page">
            <MainComponent />
          </div>
        </Route>
      </Switch>

    </Router>

  );
}

export default App;
