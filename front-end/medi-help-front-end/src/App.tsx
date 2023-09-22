import React, {useState} from "react";
import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { HomePage } from "./layouts/HomePage/HomePage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import {Redirect, Route, Switch} from "react-router-dom";
import {ThreadView} from "./layouts/ThreadView/ThreadView";
import {UserProfile} from "./layouts/Profiles/UserProfile/UserProfile";
import {LoginPage} from "./Auth/LoginPage";
import {SignupPage} from "./Auth/SignupPage";
import {UserContext} from "./Auth/UserContext";


function App() {
    const [isAuthorised, setisAuthorised] = useState(false);
    const [current_user_id, setcurrent_user_id] = useState("");
    const [current_user_type, setcurrent_user_type] = useState("");
  return (
    <div>
        <UserContext.Provider value={{isAuthorised, setisAuthorised, current_user_id, setcurrent_user_id, current_user_type, setcurrent_user_type}}>
          <Navbar />
            <Switch>
                <Route path='/' exact>
                    <Redirect to="/home"/>
                </Route>
                <Route path='/home'>
                    <HomePage/>
                </Route>
                <Route path='/thread'>
                    <ThreadView/>
                </Route>
                <Route path='/profile'>
                    <UserProfile/>
                </Route>
                <Route path='/login'>
                    <LoginPage/>
                </Route>
                <Route path='/signup'>
                    <SignupPage/>
                </Route>
            </Switch>
          <Footer />
        </UserContext.Provider>
    </div>
  );
}

export default App;
