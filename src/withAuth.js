import React from 'react';
import {getConfig} from './config/index';

const withAuth = WrappedComponent => {
  const Authorized = props => {
    const {auth} = getConfig();
    return <WrappedComponent auth={auth} {...props} />;
  };
  return Authorized;
};

export default withAuth;
