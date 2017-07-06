import React from 'react';
import {mount} from 'enzyme';
import {Switch, MemoryRouter} from 'react-router';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import AuthRoutes from './AuthRoutes';
import PrivateRoute from './PrivateRoute';
import {initReactDevise} from '../config';

const MyComponent = () => {
  return <div className="my-component" />;
};

const createMockStore = configureMockStore();

let store, component;

const App = ({store, authorize}) => (
  <Provider store={store}>
    <MemoryRouter initialIndex={0} initialEntries={['/']}>
      <Switch>
        <PrivateRoute exact path="/" component={MyComponent} authorize={authorize} />
        <AuthRoutes />
      </Switch>
    </MemoryRouter>
  </Provider>
);

const expectAuthorized = component => {
  expect(component.find('div.my-component')).toHaveLength(1);
};

const expectUnauthorized = component => {
  expect(component.find('div.my-component')).toHaveLength(0);
  expect(component.find('.auth-form')).toHaveLength(1);
  expect(component.find('h1').text()).toBe('Login');
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
    expectAuthorized(component);
  });
  it('should NOT render the route when current user is NOT logged in', () => {
    store = createMockStore({
      currentUser: {
        isLoggedIn: false
      }
    });
    component = mount(<App store={store} />);
    expectUnauthorized(component);
  });
  it.only('should render the route when passes custom authorize', () => {
    store = createMockStore({
      currentUser: {
        isLoggedIn: false
      }
    });
    const customAuthorize = currentUser => true;
    component = mount(<App store={store} authorize={customAuthorize}/>);
    expectAuthorized(component);
  });
  it('should NOT render the route when fails custom authorize', () => {
    store = createMockStore({
      currentUser: {
        isLoggedIn: true
      }
    });
    const customAuthorize = currentUser => false;
    component = mount(<App store={store} authorize={customAuthorize}/>);
    expectUnauthorized(component);
  });
});
