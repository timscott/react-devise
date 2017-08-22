import React from 'react';
import {getConfig} from './config/index';

const withAuth = WrappedComponent => {
  const Authorized = props => {
    const config = getConfig();
    return <WrappedComponent auth={config} {...props} />;
  };
  return Authorized;
};

export default withAuth;
