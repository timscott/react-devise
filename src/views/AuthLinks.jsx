import React from 'react';
import {connect} from 'react-redux';
import {getConfig} from '../config/index';
import {withRouter, Link} from 'react-router-dom';

const AuthLinkItem = ({component: Component, path, currentPath, children}) => {
  if (path === currentPath) {
    return null;
  }
  return (
    <Component>
      <Link to={path}>{children}</Link>
    </Component>
  );
};

const AuthLinksComponent = ({currentUser, match, resourceName, AuthLinksList, AuthLinksListItem}) => {
  if (currentUser.isLoggingIn) {
    return <div>Logging in...</div>;
  }
  if (currentUser.isLoggedIn) {
    return null;
  }
  const {routes} = getConfig();
  const linkableRouteNames = Object.keys(routes).filter(routeName => Boolean(routes[routeName].linkText));
  return (
    <AuthLinksList>
      {linkableRouteNames.map(routeName => {
        const path = `/${resourceName}${routes[routeName].path}`;
        return (
          <AuthLinkItem
            key={path}
            path={path}
            currentPath={match.path}
            component={AuthLinksListItem}
          >
            {routes[routeName].linkText}
          </AuthLinkItem>
        );
      })}
    </AuthLinksList>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  };
};

const AuthLinks = withRouter(connect(mapStateToProps)(AuthLinksComponent));

export {
  AuthLinks as default,
  AuthLinksComponent
};
