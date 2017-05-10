import React from 'react';
import defaultMessages from './defaultMessages';
import formPluginPlain from './formPluginPlain';
import {AuthLinks} from '../views';

let instance;

class Config {
  constructor({
    clientResourceName = 'users',
    apiResourceName = 'auth',
    apiHost,
    formPlugins = [],
    messages = {}
  } = {}) {
    const defaultFormPlugin = formPluginPlain.plugin();
    this.formPlugin = Object.assign({}, defaultFormPlugin, ...formPlugins);
    const AuthLinksComponent = props => {
      return <AuthLinks
        resourceName={clientResourceName}
        {...this.formPlugin}
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
      formPlugin: this.formPlugin,
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
