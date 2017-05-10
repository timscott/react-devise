import React from 'react';
import {Route} from 'react-router';
import requireAuth from './requireAuth';

const PrivateRoute = ({component: Component, layout: Layout, ...more}) => {
  return <Route {...more} render={props => {
    const AuthedComponent = requireAuth(Component);
    const element = <AuthedComponent {...props} />;
    return Layout ? <Layout {...props}>{element}</Layout> : element;
  }}/>;
};

export default PrivateRoute;
