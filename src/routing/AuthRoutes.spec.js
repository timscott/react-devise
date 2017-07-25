import React from 'react';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import authRoutes, {AuthRoutesComponent} from './authRoutes';
import {initReactDevise} from '../config';
import {Route, Switch} from 'react-router';

const MyLogin = () => {
  return <div className="my-login" />;
};

describe('authRoutes', () => {
  const auth = {clientResourceName: 'users'};
  it('should return a route to users', () => {
    initReactDevise(auth);
    const component = shallow(<div>{authRoutes()}</div>);
    const routes = component.find(Route);
    expect(routes).toHaveLength(1);
    expect(routes.prop('path')).toEqual(`/${auth.clientResourceName}`);
  });
});

describe('<AuthRoutesComponent />', () => {
  const auth = {clientResourceName: 'users'};
  it('should render 6 routes', () => {
    initReactDevise(auth);
    const component = shallow(<AuthRoutesComponent />);
    expect(component.find(Switch)).toHaveLength(1);
    expect(component.find(Route)).toHaveLength(7);
  });
  it('should render with custom views', () => {
    initReactDevise({
      ...auth,
      routes: {
        login: {
          path: '/foo',
          component: MyLogin
        }
      }
    });
    const component = shallow(<AuthRoutesComponent />);
    expect(component.find(Route)).toHaveLength(7);
    const tree = shallowToJson(component);
    expect(tree.children.some(n => n.props.path === '/users/foo')).toBeTruthy();

    // TODO: This does not test that custom view component is being used.
    // expect(component.find('div.my-login')).toHaveLength(1);
  });
});
