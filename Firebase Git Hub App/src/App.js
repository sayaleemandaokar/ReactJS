import React, {useState} from "react";
import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
 
//react-router
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//toast
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

//firebase
import firebase from "firebase/app";
import "firebase/auth";


//components
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";

import {UserContext} from "./context/UserContext"
import Footer from "./layout/Footer";
import Header from "./layout/Header";

//import firebase configuration
import firebaseConfig from "./Config/firebaseConfig";

//init firebase
firebase.initializeApp(firebaseConfig);

const App = () => {

  const [user, setUser] = useState(null); //pay attention towards null or u will get error. It should not be empty

  return (
    <Router>
      <ToastContainer />
        <UserContext.Provider value = {{user, setUser}}>
          <Header />
          <Switch>
            <Route exact path="/" component= {Home} />
            <Route exact path="/Signin" component= {Signin} />
            <Route exact path="/Signup" component= {Signup} />
            <Route exact path="*" component= {PageNotFound} />  //* for all other components mention it at end 
          </Switch>
          <Footer />
        </UserContext.Provider>
    </Router>
  );
}

export default App;
