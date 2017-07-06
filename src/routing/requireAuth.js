import React from 'react';
import {Redirect, withRouter} from 'react-router';
import {connect} from 'react-redux';
import {getConfig} from '../config/index';

const requireAuth = (WrappedComponent, {authorize, ...props}) => {
  let Authorizer = ({currentUser, location}) => {
    const authorized = authorize ? authorize(currentUser) : currentUser.isLoggedIn;
    if (authorized) {
      return <WrappedComponent {...props} />;
    }
    const {clientResourceName, routes: {login}, messages: {mustLoginMessage}} = getConfig();
    return <Redirect to={{
      pathname: `/${clientResourceName}${login.path}`,
      state: {
        alert: mustLoginMessage,
        from: location
      }}}
    />;
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
