import React from 'react';
import {Route, Switch} from 'react-router';
import {getConfig} from '../config/index';

const defaultNotFoundComponent = () => <div>Not Found</div>;

const AuthRoutesComponent = ({wrapper: Wrapper = Route, notFoundComponent = defaultNotFoundComponent} = {}) => {
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
      <Wrapper component={notFoundComponent}/>
    </Switch>
  );
};

const authRoutes = ({wrapper, notFound} = {}) => {
  const chooseRoute = () => (
    <AuthRoutesComponent
      wrapper={wrapper}
      notFound={notFound}
    />
  );
  const {auth} = getConfig();
  return <Route path={`/${auth.clientResourceName}`} component={chooseRoute} />;
};

export {
  authRoutes as default,
  AuthRoutesComponent
};
