import React from 'react';
import {connect} from 'react-redux';
import {getConfig} from './config/index';

const mapStateToProps = ({currentUser}) => {
  return {
    currentUser,
  };
};

const withAuth = WrappedComponent => {
  const Authorized = ({currentUser}) => {
    const {auth} = getConfig();
    return <WrappedComponent auth={auth} currentUser={currentUser} {...props} />;
  };

  return connect(mapStateToProps)(Authorized);
};

export default withAuth;
