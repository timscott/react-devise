import {fetchJSON} from './api';
import {UnauthorizedError, ValidationError} from '../errors';
import {setAuthToken, removeAuthToken} from './authTokenStore';
import {getConfig} from '../config/index';

const ROUTES = {
  login: {
    method: 'POST',
    path: 'sign_in'
  },
  signUp: {
    method: 'POST',
    path: null
  },
  confirm: {
    method: 'GET',
    path: 'confirmation'
  },
  resetPassword: {
    method: 'POST',
    path: 'password'
  },
  changePassword: {
    method: 'PATCH',
    path: 'password'
  },
  updateUser: {
    method: 'PATCH',
    path: null
  },
  destroyUser: {
    method: 'DELETE',
    path: null
  },
  requestReconfirm: {
    method: 'POST',
    path: 'confirmation'
  }
};

const ensureValid = response => {
  if (response.status === 422) {
    return response.json().then(({errors}) => {
      throw new ValidationError(errors);
    });
  }
  return response;
};

const fetch = (route, data) => {
  const {apiHost = '', apiResourceName} = getConfig();
  const uri = [apiHost, apiResourceName, route.path].join('/');
  return fetchJSON(uri, {
    method: route.method,
    data
  });
};

const fetchWithUserForm = (route, data) => { // eslint-disable-line camelcase
  return fetch(route, {
    user: data
  }).then(ensureValid);
};

const tryLogin = (response, dispatch) => {
  const auth = response.headers.get('Authorization');
  if (auth) {
    const [_, authToken] = auth.split(' '); // eslint-disable-line no-unused-vars
    setAuthToken(authToken);
    dispatch({
      type: 'LOGGED_IN',
      payload: authToken
    });
  }
  return response;
};

const signUp = (data, dispatch) => {
  return fetch(ROUTES.signUp, {
    user: data
  }).then(ensureValid).then(response => {
    return tryLogin(response, dispatch);
  });
};

const login = (data, dispatch) => {
  dispatch({
    type: 'LOGGING_IN'
  });
  return fetch(ROUTES.login, {
    user: data
  }).then(response => {
    if (response.status === 401) {
      dispatch({
        type: 'LOGIN_FAILED'
      });
      throw new UnauthorizedError();
    }
    return tryLogin(response, dispatch);
  });
};

const confirm = token => {
  return fetch(ROUTES.confirm, {
    confirmation_token: token // eslint-disable-line camelcase
  });
};

const requestReconfirm = data => fetchWithUserForm(ROUTES.requestReconfirm, data);

const requestResetPassword = data => fetchWithUserForm(ROUTES.resetPassword, data);

const resetPassword = data => fetchWithUserForm(ROUTES.changePassword, data);

const logout = dispatch => {
  removeAuthToken();
  dispatch({
    type: 'LOG_OUT'
  });
};

export {
  signUp,
  login,
  logout,
  confirm,
  requestReconfirm,
  requestResetPassword,
  resetPassword
};
