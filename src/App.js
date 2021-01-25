import React, { useEffect } from 'react';
import './stylesheets/Main.css';
import UserAdapter from './adapters/UserAdapter';
import { useDispatch } from 'react-redux';

// Pages
import LibraryPage from './pages/LibraryPage';
import LandingPage from './pages/LandingPage';
import LoginSignup from './pages/LoginSignup';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import VideoPage from './pages/VideoPage';
import VideoForm from './pages/VideoForm';
import UserPage from './pages/UserPage';

// Containers
import SideBar from './containers/SideBar';

// Components
import PrivateComponent from './components/PrivateComponent';
import SecludedComponent from './components/SecludedComponent';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
      UserAdapter.getCurrentUser()
      .then(response=>response.json())
      .then(data => {
        if(!data.message){dispatch({type: "SET_USER", currentUser: data})}
      })

      // I know this is messy, get off my case, I coded this at 3am.
      UserAdapter.GetSubscriptionInfo()
      .then(response => response.json())
      .then(subInfo => dispatch({type: "SET_SUB_INFO", subInfo}))

    }, [])

  return (
    <div className="App">
      <SideBar />
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/users/:id" component={UserPage} />
          <Route exact path="/videos/:id" component={VideoPage} />
          <Route exact path="/search" component={SearchPage} />

          <SecludedComponent exact path="/login" component={LoginSignup} />

          <PrivateComponent exact path="/profile" component={ProfilePage} />
          <PrivateComponent exact path="/library" component={LibraryPage} />
          <PrivateComponent exact path="/video/new" component={VideoForm} />
          <PrivateComponent exact path="/videos/:id/edit" component={VideoForm} />

        </Switch>
      </Router>
    </div>
  );
}

export default App;
