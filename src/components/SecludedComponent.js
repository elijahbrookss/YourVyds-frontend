import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SecludedComponent = ({component: Component, ...rest}) => {

  const currentUser = useSelector(state => state.userState.currentUser);

  return (
    <Route
      {...rest}
      render={props => currentUser ? <Redirect to = "/profile" /> : <Component {...props} />}
      />
  );
}

export default SecludedComponent;
