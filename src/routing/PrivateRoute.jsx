import React from 'react';
import {Route} from 'react-router';
import requireAuth from './requireAuth';

const PrivateRoute = ({component: Component, layout: Layout, authorize, ...more}) => {
  return <Route {...more} render={props => {
    const ResolvedComponent = requireAuth(Component, {authorize, ...props});
    const element = <ResolvedComponent />;
    return Layout ? <Layout {...props}>{element}</Layout> : element;
  }}/>;
};

export default PrivateRoute;
