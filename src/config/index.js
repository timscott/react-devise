import React from 'react';
import defaultMessages from './defaultMessages';
import defaultRoutes from './defaultRoutes';
import viewPluginPlain from './viewPluginPlain';
import {AuthLinks} from '../views';

let instance;

class Config {
  constructor({
    clientResourceName = 'users',
    apiResourceName = 'auth',
    apiHost,
    viewPlugins = [],
    defaultViewPluginSettings = {},
    messages = {},
    routes = {}
  } = {}) {
    const defaultViewPlugin = viewPluginPlain.plugin(defaultViewPluginSettings);
    this.viewPlugin = Object.assign({}, defaultViewPlugin, ...viewPlugins);
    const AuthLinksComponent = props => {
      return <AuthLinks
        resourceName={clientResourceName}
        {...this.viewPlugin}
        {...props}
      />;
    };
    this.apiHost = apiHost;
    this.apiResourceName = apiResourceName;
    this.clientResourceName = clientResourceName;
    this.messages = Object.assign({}, defaultMessages, messages);
    this.AuthLinks = AuthLinksComponent;
    this.routes = Object.keys(defaultRoutes).reduce((result, routeName) => {
      result[routeName] = Object.assign(defaultRoutes[routeName], routes[routeName] || {});
      return result;
    }, {});
  }
}

const getConfig = () => instance;

const init = args => {
  instance = new Config(args);
  return getConfig;
};

export {
  init as initReactDevise,
  getConfig
};
