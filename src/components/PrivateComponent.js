import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateComponent = ({component: Component, ...rest}) => {

  const currentUser = useSelector(state => state.userState.currentUser);

  return (
    <Route
      {...rest}
      render={props => currentUser ? <Component {...props} /> : <Redirect to = "/login" /> }
      />
  );
}

export default PrivateComponent;
