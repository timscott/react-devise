import React from 'react';
import {Route, Switch} from 'react-router';
import {getConfig} from '../config/index';
import requireAuth from './requireAuth';

const defaultNotFoundComponent = () => <div>Not Found</div>;

const AuthRoutesComponent = ({wrapper: Wrapper = Route, notFoundComponent: NotFoundComponent = defaultNotFoundComponent} = {}) => {
  const config = getConfig();
  const {clientResourceName, routes} = config;
  return (
    <Switch>
      {Object.keys(routes).map(routeName => {
        const route = routes[routeName];
        const fullPath = `/${clientResourceName}${route.path ? route.path : ''}`;
        const component = props => <route.component
          auth={config}
          {...props}
        />;
        const routeProps = {
          key: fullPath,
          exact: true,
          path: fullPath,
          component
        };
        if (route.requireAuth) {
          const ResolvedComponent = requireAuth(Wrapper, routeProps);
          return <ResolvedComponent {...routeProps}/>;
        }
        return <Wrapper key={routeName} {...routeProps}/>;
      })}
      <NotFoundComponent />
    </Switch>
  );
};

let instance;

const authRoutes = ({wrapper, notFoundComponent} = {}) => {
  if (!instance) {
    const chooseRoute = () => (
      <AuthRoutesComponent
        wrapper={wrapper}
        notFoundComponent={notFoundComponent}
      />
    );
    instance = chooseRoute;
  }
  const {clientResourceName} = getConfig();
  return <Route path={`/${clientResourceName}`} component={instance} />;
};

export {
  authRoutes as default,
  AuthRoutesComponent
};
