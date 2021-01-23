import '../stylesheets/LandingPage.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

const LandingPage = () => {
  const [redirectUser, doRedirectUser] = useState(false)

  const userState = useSelector(state => state.userState)
  return (
    <div className="landing-page-holder">
      <div className="bg-img">
        <div className="main-text">
          <h1> YourVyds </h1>
          <h5> Streaming app for developers </h5>
          {
            userState.currentUser ?
            null :
            <div id="buttons-holder">
              <button onClick={() => doRedirectUser(true)}>Join Now</button>
            </div>
          }
        </div>
      </div>
      { redirectUser ? <Redirect push to='/login'/> : null }
    </div>
  );
}

export default LandingPage
