import React from 'react';
import {connect} from 'react-redux';
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

const AuthLinks = ({currentUser, match, resourceName, AuthLinksList, AuthLinksListItem}) => {
  if (currentUser) {
    if (currentUser.isLoggingIn) {
      return <div>Logging in...</div>;
    }
    return null;
  }
  return (
    <AuthLinksList>
      <AuthLinkItem
        path={`/${resourceName}/login`}
        currentPath={match.path}
        component={AuthLinksListItem}
      >
        Log In
      </AuthLinkItem>
      <AuthLinkItem
        path={`/${resourceName}/sign-up`}
        currentPath={match.path}
        component={AuthLinksListItem}
      >
        Sign Up
      </AuthLinkItem>
      <AuthLinkItem
        path={`/${resourceName}/password/new`}
        currentPath={match.path}
        component={AuthLinksListItem}
      >
        Reset Your Password
      </AuthLinkItem>
      <AuthLinkItem
        path={`/${resourceName}/confirmation/new`}
        currentPath={match.path}
        component={AuthLinksListItem}
      >
        Resend Confirmation Instructions
      </AuthLinkItem>
    </AuthLinksList>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  };
};

export default withRouter(connect(mapStateToProps)(AuthLinks));
