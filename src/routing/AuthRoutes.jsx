import React from 'react';
import {Route, Switch} from 'react-router';
import {getConfig} from '../config/index';
import requireAuth from './requireAuth';

const defaultNotFoundComponent = () => <div>Not Found</div>;

const AuthRoutesComponent = ({wrapper: Wrapper = Route, notFoundComponent = defaultNotFoundComponent} = {}) => {
  const {auth, routes} = getConfig();
  return (
    <Switch>
      {Object.keys(routes).map(routeName => {
        const route = routes[routeName];
        const fullPath = `/${auth.clientResourceName}${route.path ? route.path : ''}`;
        const component = props => <route.component
          auth={auth}
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
        return <Wrapper {...routeProps}/>;
      })}
      <Wrapper component={notFoundComponent}/>
    </Switch>
  );
};

let instance;

const authRoutes = ({wrapper, notFound} = {}) => {
  if (!instance) {
    const chooseRoute = () => (
      <AuthRoutesComponent
        wrapper={wrapper}
        notFound={notFound}
      />
    );
    instance = chooseRoute;
  }
  const {auth} = getConfig();
  return <Route path={`/${auth.clientResourceName}`} component={instance} />;
};

export {
  authRoutes as default,
  AuthRoutesComponent
};
