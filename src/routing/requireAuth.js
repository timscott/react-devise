import React from 'react';
import {Redirect} from 'react-router';
import {connect} from 'react-redux';
import {getConfig} from '../config/index';

const requireAuth = (WrappedComponent, props) => {
  return connect(state => {
    return {
      currentUser: state.currentUser
    };
  })(({currentUser, location}) => {
    if (currentUser.isLoggedIn) {
      return <WrappedComponent {...props} />;
    }
    const {clientResourceName, messages: {mustLoginMessage}} = getConfig();
    return <Redirect to={{
      pathname: `/${clientResourceName}/login`,
      state: {
        alert: mustLoginMessage,
        from: location
      }}}
    />;
  });
};

export default requireAuth;
