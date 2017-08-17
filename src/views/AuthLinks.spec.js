import React from 'react';
import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import {AuthLinksComponent} from './AuthLinks';
import {initReactDevise} from '../config';

describe('<AuthLinksComponent />', () => {
  const resourceName = 'users';
  const currentUser = {isLoggedIn: false};
  const AuthLinksList = ({children}) => <ul>{children}</ul>;
  const AuthLinksListItem = ({children}) => <li>{children}</li>;
  const location = {pathname: 'no-match'};

  it('should render list with 4 links', () => {
    initReactDevise();
    const component = shallow(<AuthLinksComponent
      resourceName={resourceName}
      AuthLinksList={AuthLinksList}
      AuthLinksListItem={AuthLinksListItem}
      currentUser={currentUser}
      location={location}
    />);
    const tree = shallowToJson(component);
    [
      ['/users/login', 'Log In'],
      ['/users/sign-up', 'Sign Up'],
      ['/users/confirmation/new', 'Resend Confirmation Instructions'],
      ['/users/password/new', 'Reset Your Password']
    ].forEach(route => {
      expect(tree.children.some(n => n.props.path === route[0] && n.children[0] === route[1])).toBeTruthy();
    });
  });
  it('should render link for custom route', () => {
    initReactDevise({
      routes: {
        login: {
          path: '/foo',
          linkText: 'Foo Bar'
        }
      }
    });
    const component = shallow(<AuthLinksComponent
      resourceName={resourceName}
      AuthLinksList={AuthLinksList}
      AuthLinksListItem={AuthLinksListItem}
      currentUser={currentUser}
      location={location}
    />);
    const tree = shallowToJson(component);
    expect(tree.children.some(n => n.props.path === '/users/foo' && n.children[0] === 'Foo Bar')).toBeTruthy();
  });
});
