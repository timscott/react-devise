import React from 'react';
import {Route, Switch} from 'react-router';
import {getConfig} from '../config/index';

const AuthRoutes = ({wrapper: Wrapper = Route}) => {
  const {auth, routes} = getConfig();
  return (
    <Switch>
      {Object.keys(routes).map(routeName => {
        const route = routes[routeName];
        const fullPath = `/${auth.clientResourceName}${route.path}`;
        return <Wrapper
          key={fullPath}
          exact
          path={fullPath}
          component={props => <route.component
            auth={auth}
            {...props}
          />}
        />;
      })}
    </Switch>
  );
};

export default AuthRoutes;
