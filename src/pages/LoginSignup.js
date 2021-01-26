import '../stylesheets/LoginSignup.css'
import { Button, Form } from 'semantic-ui-react'
import UserAdapter from '../adapters/UserAdapter'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from "react-router-dom";

const defaultImg = "https://res.cloudinary.com/dxftl1qzu/image/upload/v1611617383/default_image_wqbtcu.png"

const LoginSignup = () => {

  // States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState(null); //Two Modes: Log in, Sign up
  const [renderIncorrect, setIncorrect] = useState(false);
  const [redirectUser, doRedirectUser] = useState(false);
  const [profilePicture, setProfilePicture] = useState(defaultImg)

  // Variables
  const dispatch = useDispatch();

  const submitForm = () => {
    if(username===""){ return } //If the username is empty *I'm lazy*

    const userCredentials = {user: {username, password}} //Object to be sent on request
    const loggingIn = mode === "Log in" ? true : false

    if(mode) {
      if(loggingIn){
        UserAdapter.LoginUser(userCredentials)
        .then(response => response.json())
        .then(processData)
      }else{
        UserAdapter.CreateUser(userCredentials)
        .then(response => response.json())
        .then(processData)
      }
    }else{
      checkIfUserExists();
    }
  }

  const processData = data => {
    localStorage.setItem('auth_key', data['jwt'])
    if(mode === "Log in"){
      if(isPermitted(data)){doRedirectUser(true); dispatch({type: "SET_USER",  currentUser: data}) }
    } else {

      dispatch({type: "SET_USER",  currentUser: data});
      doRedirectUser(true)
    }
  }

  const isPermitted = data => {
    if(!data['jwt']){
      setIncorrect(true);
      return false
    }else{
      setIncorrect(false);
      return true
    }
  }

  const checkIfUserExists = () => {
    UserAdapter.checkIfUserExists(username)
    .then(response => response.json())
    .then(json => {
      if(json.message){
        setProfilePicture(json.profile_picture)
        setMode('Log in')
      }else{
        setMode('Sign up')
      }
    })
  }

  const method = text => {
    if(mode){
      setPassword(text)
    }else {
      setUsername(text)
    }
  }

  const incorrectStyle = {
    background: "rgba(75, 0, 0, .2)",
    borderColor: "rgba(200, 0, 0, .3)",
  }

  return (
    <div className="login-page-holder">
      {
        mode ?
        <button
          onClick={() => {setMode(null); setIncorrect(false); setPassword(''); setProfilePicture(defaultImg)}}
          className="go-back">
          <i className="fas fa-arrow-left"></i>
        </button>
        :
        null
      }

      <h1 className="title">{ mode ?  mode === "Log in" ? "Log In" : "Sign Up" : "Welcome"}</h1>
      <div className="user-form">
        <img src={ profilePicture }/>
        <Form onSubmit={submitForm}>
          {mode ? <h3 id="username"> {username} </h3> : null }
          <Form.Field>
            <input
              style={mode ? renderIncorrect ? incorrectStyle : null : null}
              onChange={e => method(e.target.value)}
              placeholder={ mode ? mode==="Log in" ? "Enter Password" : "Create Password" : "Enter Username"}
              type={mode ? "password" : null}
              value={mode ? password : username}
            />

          </Form.Field>

          <Button type='submit'>Submit</Button>
        </Form>
      </div>

      {redirectUser ? <Redirect to="/profile" /> : null}
    </div>
  );
}

export default LoginSignup
