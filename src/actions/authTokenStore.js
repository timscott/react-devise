const KEY = 'authToken';

const setAuthToken = authToken => localStorage.setItem(KEY, authToken);

const removeAuthToken = () => localStorage.removeItem(KEY);

const getAuthToken = () => localStorage.getItem(KEY);

const hasAuthToken = () => Boolean(getAuthToken());

const getBearerToken = () => {
  const authToken = getAuthToken();
  if (authToken) {
    return `Bearer ${authToken}`;
  }
};

const addAuthorizationHeaderToRequest = (request, next) => {
  const bearerToken = getBearerToken();
  if (bearerToken) {
    request.options.headers = request.options.headers || {};
    request.options.headers.authorization = bearerToken;
  }
  if (next) {
    next();
  }
};

export {
  setAuthToken,
  removeAuthToken,
  getAuthToken,
  hasAuthToken,
  getBearerToken,
  addAuthorizationHeaderToRequest
};
