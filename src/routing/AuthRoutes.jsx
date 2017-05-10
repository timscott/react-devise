import React from 'react';
import {Route, Switch} from 'react-router';
import {getConfig} from '../config/index';
import {
  Login,
  SignUp,
  Confirm,
  RequestResetPassword,
  ResetPassword,
  RequestReconfirm
} from '../views';

const views = [
  {path: '/login', component: Login},
  {path: '/sign-up', component: SignUp},
  {path: '/confirmation/new', component: RequestReconfirm},
  {path: '/confirmation', component: Confirm},
  {path: '/password/new', component: RequestResetPassword},
  {path: '/password/edit', component: ResetPassword}
];

const AuthRoutes = ({wrapper: Wrapper = Route}) => {
  const {auth} = getConfig();
  return (
    <Switch>
      {views.map(view => {
        const fullPath = `/${auth.clientResourceName}${view.path}`;
        return <Wrapper
          key={fullPath}
          exact
          path={fullPath}
          component={props => <view.component
            auth={auth}
            {...props}
          />}
        />;
      })}
    </Switch>
  );
};

export default AuthRoutes;
