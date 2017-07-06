import React from 'react';
import {mount} from 'enzyme';
import {Switch, Route, MemoryRouter} from 'react-router';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import AuthRoutes from './AuthRoutes';
import PrivateRoute from './PrivateRoute';
import {initReactDevise} from '../config';

const Private = () => {
  return <div className="my-private-component" />;
};

const Unauthorized = () => {
  return <div className="unauthorized" />;
};

const createMockStore = configureMockStore();

let store, component;

const App = ({store, authorize}) => (
  <Provider store={store}>
    <MemoryRouter initialIndex={0} initialEntries={['/']}>
      <Switch>
        <PrivateRoute exact path="/" component={Private} authorize={authorize} />
        <Route exact path="/unauthorized" component={Unauthorized} />
        <AuthRoutes />
      </Switch>
    </MemoryRouter>
  </Provider>
);

const expectPrivate = component => {
  expect(component.find('div.my-private-component')).toHaveLength(1);
};

const expectLogin = component => {
  expect(component.find('.auth-form')).toHaveLength(1);
  expect(component.find('h1').text()).toBe('Login');
};

const expectUnauthorized = component => {
  expect(component.find('div.unauthorized')).toHaveLength(1);
};

beforeAll(() => {
  initReactDevise();
});

describe('PrivateRoute', () => {
  it('should render the route when current user is logged in', () => {
    store = createMockStore({
      currentUser: {
        isLoggedIn: true
      }
    });
    component = mount(<App store={store} />);
    expectPrivate(component);
  });
  it('should redirect to login when current user is NOT logged in', () => {
    store = createMockStore({
      currentUser: {
        isLoggedIn: false
      }
    });
    component = mount(<App store={store} />);
    expectLogin(component);
  });
  it('should render the route when passes custom authorize', () => {
    store = createMockStore({
      currentUser: {
        isLoggedIn: false
      }
    });
    const customAuthorize = currentUser => ({
      authorized: true
    });
    component = mount(<App store={store} authorize={customAuthorize}/>);
    expectPrivate(component);
  });
  it('should NOT render the route when fails custom authorize', () => {
    store = createMockStore({
      currentUser: {
        isLoggedIn: true
      }
    });
    const customAuthorize = currentUser => ({
      authorized: false,
      redirectTo: {
        pathname: '/unauthorized'
      }
    });
    component = mount(<App store={store} authorize={customAuthorize}/>);
    expectUnauthorized(component);
  });
});
