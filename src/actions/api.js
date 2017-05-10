import urlHelper from 'url';
import {getBearerToken} from './authTokenStore';
import 'fetch-bluebird';

const doFetch = (url, args) => {
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const bearerToken = getBearerToken();
  if (bearerToken) {
    headers.authorization = bearerToken;
  }
  return fetch(url, {
    ...args,
    headers
  });
};

const fetchWithQuery = (url, {method, data}) => {
  const query = urlHelper.format({query: data});
  return doFetch(`${url}${query}`, {
    method
  });
};

const fetchWithPayload = (url, {method, data}) => {
  return doFetch(url, {
    method,
    body: JSON.stringify(data)
  });
};

const fetchJSON = (url, args) => {
  switch (args.method.toUpperCase()) {
    case 'POST':
    case 'PUT':
    case 'PATCH':
      return fetchWithPayload(url, args);
    case 'GET':
    case 'DELETE':
    default:
      return fetchWithQuery(url, args);
  }
};

const getJSON = (url, args) => fetchJSON(url, {
  ...args,
  method: 'GET'
});

const postJSON = (url, args) => fetchJSON(url, {
  ...args,
  method: 'POST'
});

export {
  fetchJSON,
  getJSON,
  postJSON
};
