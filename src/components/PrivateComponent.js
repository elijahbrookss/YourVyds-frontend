import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateComponent = ({component: Component, ...rest}) => {

  const currentUser = localStorage.getItem("auth_key");
  return (
    <Route
      {...rest}
      render={
        props => currentUser && currentUser!=='null' ?
        <Component {...props} />
        :
        <Redirect to = "/login" />
      }
      />
  );
}

export default PrivateComponent;
