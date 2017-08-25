ATTENTON: For now, this must be considered experimental software and not to be used in production.

React Devise
=========================
For some time Devise has been the go-to authentication library for Rails apps. Just drop Devise into your Rails app, make a few tweaks, then get on with building the awesome business features of your app. But when we develop an SPA  app with React for the front end and Rails for the API, must we leave Devise behind?

It turns out it's not very hard to purpose Devise as an authentication backend. The bigger job is to replicate all the view-related functionality Devise gave us out of the box for server rendered apps.

Enter **React Devise**. The goal of this library is to reduce the friction of adding authentication to a new React/Rails app. We aim to reduce it to the very low level that Rails developers have come to expect while maintaining flexibility to make it your own.

## Reference App

Have a look at a reference implementation.

* [The code](https://github.com/timscott/react-devise-sample)
* [Demo on Heroku](http://react-devise-sample.herokuapp.com/)

## Dependencies

React Devise has deep dependencies on some popular React modules. The most significant are:

* [react-redux](https://github.com/reactjs/react-redux)
* [react-router](https://github.com/ReactTraining/react-router)
* [redux-form](https://github.com/erikras/redux-form)

If you don't want to use these in your app, then React Devise is probably not for you.

## Installation

```
yarn add react-devise
```

## Basic Usage

1. Call `initReactDevise` as early as possible in your application, and before using any other part of React Devise. This function returns a function which returns the config object.

2. Add `reactDeviseReducers` to your store.

3. Within the `Router` element call `authRoutes`. `authRoutes` takes two arguments:

| Arg         | Default                      | Description                                                                                                                      |
|-------------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `wrapper`   | `Route`                      | Useful when you have a higher order component that wraps routes with a layout, for example.                                      |
| `notFound`  | `() => <div>Not Found</div>` | The component to render when the route matches the top level route (e.g., `/users`) but does not match any nested route. |

```js
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import reducers from './reducers'
import {initReactDevise, authRoutes, PrivateRoute} from 'react-devise';
import reactDeviseReducers from 'react-devise/lib/reducers';

const {clientResourceName} = initReactDevise()();

const store = createStore(
  combineReducers({
    ...reducers,
    ...reactDeviseReducers
  })
);

const App = () => {
  return (
    <Provider store={store}/>
      <Router history={createBrowserHistory()}>
        <Switch>
          <PrivateRoute exact path="/products" component={Products} />
          <Route exact path="/" component={Home} />
          {authRoutes({notFoundComponent: NotFound})}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
}
```

### PrivateRoute

Use `PrivateRoute` for any route that requires authorization. If the user visits a private route while not authorized, he will be redirected to the login route.

By default `PrivateRoute` uses `currentUser.isLoggedIn` to decide if the user is authorized. You can override this with the `authorize` prop, a function that returns an object in the form `{authorized, redirectTo}`.

```js
<PrivateRoute exact
  path="/admin"
  component={Admin}
  authorize={currentUser => {{
    authorized: currentUser.isAdmin,
    redirectTo: {
      pathname: '/unauthorized'
    }
  }}
/>
```

`redirectTo` is a react-router [location](https://reacttraining.com/react-router/web/api/Redirect) which defaults to the login route. However, keep in mind that the login component redirects to the referrer when `currentUser.isLoggedIn` equals `true`. This can ___cause a redirect loop___. So normally you should provide a custom unauthorized route.

> **ATTENTION**: _`PrivateRoute` does **not** protect your server. It only prevents routing to client components. It would be very easy for a user to circumvent. Your server must handle authorization of any calls that originate from private routes or anywhere in your client application._

## Customization

To customize the appearance and behavior of React Devise, pass a settings object into `initReactDevise`.

```js
import ReactDeviseMaterialUI from 'react-devise-material-ui';
import {Form, Alert, UnstyledList, AuthListItem, FormError, AuthHeading, AuthViewContainer} from '../components';

const myCustomPlugin = {
  Form,
  FormError,
  Alert,
  AuthLinksList: UnstyledList,
  AuthLinksListItem: AuthListItem,
  Heading: AuthHeading,
  View: AuthViewContainer
};

initReactDevise({
  clientResourceName: 'customers',
  apiResourceName: 'api/auth',
  apiHost: 'http://auth.example.com',
  viewPlugins: [
    ReactDeviseMaterialUI.plugin(),
    myCustomPlugin
  ],
  messages: {
    loginFailed: 'Whoa there. Bad login!'
  }
});
```

| Setting                     | Default Value | Description                                                                              |
| ----------------------------|---------------|------------------------------------------------------------------------------------------|
| `clientResourceName`        | "users"       | The first node in the route to each auth view. |
| `apiResourceName`           | "auth"        | The resource name used by Devise on the server. The first node in the path of API calls. |
| `apiHost`                   | `undefined`   | Omit unless your devise API is host on a different domain than the website. |
| `viewPlugins`               | []            | Use one or more view plugins to inject custom components into React Devise views.<br><br>View plugins are merged in order *after* the default plugin. Taking the code sample above, `myCustomPlugin supersede `ReactDeviseMaterialUI` plugin, which in turn supersede the default plugin.<br/><br/>To see how to build custom plugin components, [take a look at the default plugin](https://github.com/timscott/react-devise/blob/master/src/config/viewPluginPlain.js).|
| `defaultViewPluginSettings` | {}            | To customize the default plugin, provide a settings object. This can be used in conjunction with custom plugins or without them.<br><br>To see the available settings, find the default plugin [here]( https://github.com/timscott/react-devise/blob/master/src/config/viewPluginPlain.js). |
| `messages`                  | {}            | Override the default messages used by React Devise. Default messages are [here](https://github.com/timscott/react-devise/blob/master/src/config/defaultMessages.js). |


### Styled Components

React Devise plays nicely with [styled-components](https://github.com/styled-components/styled-components). For example, `UnstlyedList` (in the prior code sample) might be:

```js
import styled from 'styled-components';

const UnstyledList = styled.ul`
  list-style: none;
  padding: 0;
  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export default UnstyledList;
```

## Customizing Routes

Given that the default value of `clientResourceName` is "users", the [default auth routes](https://github.com/timscott/react-devise/blob/master/src/config/defaultRoutes.js) are:

* /users/login
* /users/sign-up/
* /users/confirmation/new
* /users/confirmation
* /users/password/new
* /users/password/edit

You can customize the auth routes:

```js
initReactDevise({
  // other config
  routes: {
    signup: {
      component: MyFancySignupForm,
      path: '/signup-for-fun-and-profit',
      linkText: 'Hey, Signup Now!'
    }
  }
});
```

Custom routes are deep merged with the defaults, so you only need to specify the properties you want to change. Say for example you're happy with the default path and link text for the signup route, but you want to use a custom view component:

```js
initReactDevise({
  // other config
  routes: {
    signup: {
      component: MyFancySignupForm
    }
  }
});
```

This provides a way to replace the built-in views with completely custom views. Similar to server-rendered Devise, it's probably easiest to start with a copy of the [built-in views](https://github.com/timscott/react-devise/tree/master/src/views).

## Accessing Configuration in Your Components

You can access React Devise config and also the `AuthLinks` component in your components by using `withAuth` like so:

```js
import React from 'react';
import {connect} from 'react-redux';
import {withAuth} from 'react-devise';

const Home = ({currentUser, auth: {AuthLinks}}) => {
  return (
    <div>
      <div>
        <h2>Welcome {currentUser.email}</h2>
        <AuthLinks />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  };
};

export default connect(mapStateToProps)(withAuth(Home));
```

## Middleware for Clients

Clients like [Apollo](https://github.com/apollographql/apollo) handle data access for you. React Devise provides middleware to add authentication to all requests. For example:

```js
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {addAuthorizationHeaderToRequest} from 'react-devise';

const networkInterface = createNetworkInterface({
  uri: '/graphql'
});

networkInterface.use([{
  applyMiddleware: addAuthorizationHeaderToRequest
}]);
```

`addAuthorizationHeaderToRequest` takes a `request` and an optional `next` callback.

## Devise Server Setup

Eventually we want to create a gem to avoid repeating a lot of boilerplate. For now, you have to set it up yourself.

### JWT Authentication

First, we'll use the [devise-jwt](https://github.com/waiting-for-dev/devise-jwt) gem.

```ruby
# Gemfile

 gem 'devise-jwt'
```

Add the `devise-jwt` bits in the user model (or whatever your authenticated resource is).

```ruby
# /app/models/user.rb

class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :trackable, :validatable, :confirmable,
    :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  def jwt_payload
    {
      user_id: id,
      email: email,
      firstName: first_name,
      lastName: last_name
    }
  end

end
```

### Devise Routes

Next, we might need to set a custom path in our routes to match the `apiResourceName` if it's not the same as your user model name.

```ruby
# routes.rb

devise_for :users, path: :auth
```

### Devise Failure App

Next, we need to change auth failure behavior:

```ruby
# /app/controllers/custom_auth_failure.rb

class CustomAuthFailure < Devise::FailureApp

  def respond
    self.status = :unauthorized
    self.content_type = :json
    self.response_body = {errors: ['Invalid login credentials']}.to_json
  end

end
```

### Devise Emails

(See docs here)[Devise-Server-Setup]

## To Do

* Create a ruby gem
* Ouath support
* Support multiple resource types
* Support all devise views
* Support more customization of messages
* Possibly an "eject" function to allow full customization of views
* ???
