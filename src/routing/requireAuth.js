import React from 'react';
import {Redirect, withRouter} from 'react-router';
import {connect} from 'react-redux';
import {getConfig} from '../config/index';

const requireAuth = (WrappedComponent, {authorize, ...props}) => {
  let Authorizer = ({currentUser, location}) => {
    const {authorized, redirectTo} = authorize ? authorize(currentUser) : {
      authorized: currentUser.isLoggedIn
    };
    if (authorized) {
      return <WrappedComponent {...props} />;
    }
    const {clientResourceName, routes: {login}, messages: {mustLoginMessage}} = getConfig();
    const to = redirectTo || {
      pathname: `/${clientResourceName}${login.path}`,
      state: {
        alert: mustLoginMessage,
        from: location
      }
    };
    return <Redirect to={to}/>;
  };
  Authorizer = withRouter(Authorizer);
  const mapStateToProps = state => {
    return {
      currentUser: state.currentUser
    };
  };
  return connect(mapStateToProps)(Authorizer);
};

export default requireAuth;
