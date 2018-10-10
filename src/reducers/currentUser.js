import jwtDecode from 'jwt-decode';
import { hasAuthToken, getAuthToken } from '..//actions/authTokenStore';

const initialState = {};

const currentUser = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGGING_IN':
      return {
        isLoggingIn: true
      };
    case 'LOGGED_IN':
      return {
        isLoggedIn: true,
        ...jwtDecode(action.payload)
      };
    case 'LOG_OUT':
    case 'LOGIN_FAILED':
      return initialState;
    default:
      if (_.isEmpty(state) && hasAuthToken()) {
        return {
            isLoggedIn: true,
            ...jwtDecode(getAuthToken())
          };
      }
      return state;
  }
};

export default currentUser;
