import React from "react";
import "./App.css";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { HomePage } from "./layouts/HomePage/HomePage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import {Redirect, Route, Switch} from "react-router-dom";
import {ThreadView} from "./layouts/ThreadView/ThreadView";
import {UserProfile} from "./layouts/Profiles/UserProfile/UserProfile";

function App() {
  return (
    <div>
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
        </Switch>
      <Footer />
    </div>
  );
}

export default App;
