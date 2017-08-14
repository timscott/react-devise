import React from 'react';
import {Route, Switch} from 'react-router';
import {getConfig} from '../config/index';
import requireAuth from './requireAuth';

const defaultNotFoundComponent = () => <div>Not Found</div>;

let authRoutesComponentBody;

const AuthRoutesComponent = ({wrapper: Wrapper = Route, notFoundComponent = defaultNotFoundComponent} = {}) => {
  const {auth, routes} = getConfig();
  if (!authRoutesComponentBody) {
    authRoutesComponentBody = (
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
  }
  return authRoutesComponentBody;
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
