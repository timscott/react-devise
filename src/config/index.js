import React from 'react';
import defaultMessages from './defaultMessages';
import viewPluginPlain from './viewPluginPlain';
import {AuthLinks} from '../views';

let instance;

class Config {
  constructor({
    clientResourceName = 'users',
    apiResourceName = 'auth',
    apiHost,
    viewPlugins = [],
    messages = {}
  } = {}) {
    const defaultviewPlugin = viewPluginPlain.plugin();
    this.viewPlugin = Object.assign({}, defaultviewPlugin, ...viewPlugins);
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
  }
  get auth() {
    return {
      viewPlugin: this.viewPlugin,
      clientResourceName: this.clientResourceName,
      messages: this.messages,
      AuthLinks: this.AuthLinks
    };
  }
}

const getConfig = () => instance;

const init = args => {
  if (!instance) {
    instance = new Config(args);
  }
  return getConfig;
};

export {
  init as initReactDevise,
  getConfig
};
