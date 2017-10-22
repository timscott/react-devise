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
  editRegistration: {
    method: 'GET',
    path: 'edit'
  },
  updateRegistration: {
    method: 'PATCH',
    path: null
  },
  destroyRegistration: {
    method: 'DELETE',
    path: null
  },
  requestReconfirm: {
    method: 'POST',
    path: 'confirmation'
  },
  providerLogin: {
    method: 'POST',
    path: ':provider'
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

  // Render uri with any params, and remove those params from the data payload.
  let uri = [apiHost, apiResourceName, route.path].join('/');
  Object.keys(data).forEach(param => {
    const regex = new RegExp(`\/:${param}(\/|$)`, 'g');
    if (uri.match(regex)) {
      uri = uri.replace(regex, `/${data[param]}`);
      delete data[param];
    }
  });

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

const tryLoggedIn = (response, dispatch) => {
  const auth = response.headers.get('Authorization');
  if (auth) {
    const [_, authToken] = auth.split(' '); // eslint-disable-line no-unused-vars
    if (authToken) {
      setAuthToken(authToken);
      dispatch({
        type: 'LOGGED_IN',
        payload: authToken
      });
    }
  }
  return response;
};

const signUp = (data, dispatch) => {
  return fetchWithUserForm(ROUTES.signUp, data).then(response => {
    return tryLoggedIn(response, dispatch);
  });
};

const doLogin = (route, data, dispatch) => {
  dispatch({
    type: 'LOGGING_IN'
  });
  return fetchWithUserForm(ROUTES.login, data).then(response => {
    if (response.status === 401) {
      dispatch({
        type: 'LOGIN_FAILED'
      });
      throw new UnauthorizedError();
    }
    return tryLogin(response, dispatch);
  });
};

const login = (data, dispatch) => {
  return doLogin(ROUTES.login, data, dispatch);
};

const providerLogin = function providerLogin(data, dispatch) {
  return doLogin(ROUTES.providerLogin, data, dispatch);
};

const confirm = token => {
  return fetch(ROUTES.confirm, {
    confirmation_token: token // eslint-disable-line camelcase
  });
};

const requestReconfirm = data => fetchWithUserForm(ROUTES.requestReconfirm, data);

const requestResetPassword = data => fetchWithUserForm(ROUTES.resetPassword, data);

const resetPassword = data => fetchWithUserForm(ROUTES.changePassword, data);

const editUser = () => fetch(ROUTES.editRegistration);

const updateUser = (data, dispatch) => {
  return fetchWithUserForm(ROUTES.updateRegistration, data).then(response => {
    if (response.status === 401) {
      throw new UnauthorizedError();
    }
    return tryLoggedIn(response, dispatch);
  });
};

const logout = dispatch => {
  removeAuthToken();
  dispatch({
    type: 'LOG_OUT'
  });
};

const destroyUser = (data, dispatch) => {
  return fetchWithUserForm(ROUTES.destroyRegistration, data).then(response => {
    if (response.status === 401) {
      throw new UnauthorizedError();
    }
    return logout(dispatch);
  });
};

export {
  signUp,
  login,
  providerLogin,
  logout,
  confirm,
  requestReconfirm,
  requestResetPassword,
  resetPassword,
  updateUser,
  editUser,
  destroyUser
};
