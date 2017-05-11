ATTENTON: For now, this must be considered experimental software and not to be used in production.

React Devise
=========================
For some time Devise has been the go-to authentication library for Rails apps. Just drop Devise into your Rails app, make a few tweaks, then get on with building the awesome business features of your app. But when we develop an SPA  app with React for the front end and Rails for the API, must we leave Devise behind?

It turns out it's not very hard to purpose Devise as an authentication backend. The bigger job is to replicate all the view-related functionality Devise use to give us out of the box for server rendered apps.

Enter **React Devise**. The goal of this library is to reduce the friction of adding authentication to a new React/Rails app. We aim to reduce it to the very low level that Rails developers have come to expect while maintaining flexibility to make it your own.

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

Call ```initReactDevise``` as early as possible in your application, and before using any other part of React Devise. This function returns a function which returns the config object.

Add ```reactDeviseReducers``` to your store.

Within the ```Router``` element place ```AuthRoutes```. Set the path to ```clientResourceName``` to cause the router to select among the full auth routes.

Use ```PrivateRoute``` for any route that requires authorization. If the user visits a private route while not authenticated, he will be redirected to the login route.

```javascript
import {createStore, combineReducers} from 'redux';
import {initReactDevise, AuthRoutes, PrivateRoute} from 'react-devise';
import {Router, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {Provider} from 'react-redux';
import reactDeviseReducers from 'react-devise/lib/reducers';
import reducers from './reducers'

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
          <AuthRoutes path={`/${clientResourceName}`} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
}
```

Given that the default value of ```clientResourceName``` is "users" the default auth routes are:

* /users/login
* /users/sign-up/
* /users/confirmation/new
* /users/confirmation
* /users/password/new
* /users/password/edit

## Customization

To customize the appearance and behavior of React Devise, pass a settings object into ```initReactDevise```.

```javascript
import ReactDeviseMaterialUI from 'react-devise-material-ui';
import {Form, Alert, UnstyledList, UnstyledListItem, FormError, AuthHeading, AuthViewContainer} from '../components';

const myCustomPlugin = {
  Form,
  FormError,
  Alert,
  AuthLinksList: UnstyledList,
  AuthLinksListItem: UnstyledListItem,
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

| Setting               | Default Value | Description                                                                        |
| ----------------------| ------------- |------------------------------------------------------------------------------------|
| `clientResourceName`  | "users"       | The first node in the route to each auth view.                             |
| `apiResourceName`     | "auth"        | The resource name used by devise on the server. The first node in the path of API calls.                                    |
| `apiHost`             | `undefined`   | Omit unless your devise API is host on a different domain than the website. |
| `viewPlugins`         | []            | Use view plugins to inject custom components into React Devise views.              |
| `messages`            | {}            | Override the default messages used by React Devise.                                |

Default messages are [here](https://github.com/timscott/react-devise/blob/master/src/config/defaultMessages.js).

View plugins will be merged in order with the first being the default plugin. So in the code sample above, ```myCustomPlugin``` supersede any common fields ```ReactDeviseMaterialUI``` plugin, which in turn supersede any common fields in the default plugin. Find the default plugin [here]( https://github.com/timscott/react-devise/blob/master/src/config/viewPluginPlain.js).

React Devise plays nicely with ```styled-components```. For example, ```UnstlyedList``` in the prior code sample might be:

```javascript
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

## Accessing Configuration in Your Components

You can access React Devise config and also the ```AuthLinks``` component in your components by using ```withAuth```. For example:

```javascript
import React from 'react';
import {connect} from 'react-redux';
import {withAuth} from 'react-devise';

const Home = ({currentUser, auth: {AuthLinks}}) => {
  return (
    <div>
      <div>
        <h2>Welcome {currentUser && currentUser.email}</h2>
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

```javascript
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {addAuthorizationHeaderToRequest} from 'react-devise';

const networkInterface = createNetworkInterface({
  uri: '/graphql'
});

networkInterface.use([{
  applyMiddleware: addAuthorizationHeaderToRequest
}]);
```

```addAuthorizationHeaderToRequest``` takes a ```request``` and an optional ```next``` callback.

## Devise Server Setup

Eventually we want to create a gem to avoid repeating this boilerplate. For now, you have to set it up yourself.

First, we might need to set a custom path in our routes to match the ```apiResourceName``` if it's not the same as your user model name.

```ruby
# routes.rb

devise_for :users, path: :auth
```

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

Next, we need to change the URLs in our emails to be the *client side* routes:

```ruby
# /app/helpers/users_mailer_helper.rb

module UsersMailerHelper

  url_defaults = Rails.configuration.action_mailer.default_url_options
  protocol = url_defaults[:protocol] || 'http'
  port = ":#{url_defaults[:port]}" if url_defaults[:port].present?

  Devise::URL_HELPERS.each do |module_name, actions|
    actions.each do |action|
      method = ['user', action, module_name, 'url'].compact.join '_'
      path = ['users', module_name, action].compact.join '/'

      define_method method do |params = nil|
        query = "?#{params.map {|k,v| "#{k}=#{v}"}.join('&')}" if params.present?
        "#{protocol}://#{url_defaults[:host]}#{port}/#{path}#{query}"
      end
    end
  end

end
```

```ruby
# /app/mailers/users_mailer.rb

class UsersMailer < Devise::Mailer
  helper :users_mailer # gives access to all helpers defined within `mailer_helper`.
  default template_path: 'devise/mailer' # to make sure that your mailer uses the devise views
end
```

Next, you need to edit your mailers to use the client side route helpers. For example:

```ruby
<p>Welcome <%= @email %>!</p>

<p>You can confirm your account email through the link below:</p>

<p><%= link_to 'Confirm my account', user_confirmation_url(confirmation_token: @token) %></p>
```

Finally, apply some settings in your devise initializer:


```ruby
# in your devise initializer

config.warden do |manager|
  manager.failure_app = CustomAuthFailure
end

config.mailer = 'UsersMailer'

config.navigational_formats = [:json]

```

## To Do

* Create a ruby gem
* Ouath support
* Support multiple resource types
* Support all devise views
* Support more customization of messages
* Possibly an "eject" function to allow full customization of views
* ???
