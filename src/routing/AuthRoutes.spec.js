import React from 'react';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import AuthRoutes from './AuthRoutes';
import {initReactDevise} from '../config';
import {Route, Switch} from 'react-router';

const MyLogin = () => {
  return <div className="my-login" />;
};

describe('<AuthRoutes />', () => {
  const auth = {clientResourceName: 'users'};
  it('should render 6 routes', () => {
    initReactDevise(auth);
    const component = shallow(<AuthRoutes />);
    expect(component.find(Switch)).toHaveLength(1);
    expect(component.find(Route)).toHaveLength(6);
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
    const component = shallow(<AuthRoutes />);
    expect(component.find(Route)).toHaveLength(6);
    const tree = shallowToJson(component);
    expect(tree.children.some(n => n.props.path === '/users/foo')).toBeTruthy();

    // TODO: This does not test that custom view component is being used.
    // expect(component.find('div.my-login')).toHaveLength(1);
  });
});
