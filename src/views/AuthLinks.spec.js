import React from 'react';
import {mount} from 'enzyme';
import {mountToJson} from 'enzyme-to-json';
import {AuthLinksComponent} from './AuthLinks';
import {initReactDevise} from '../config';

describe('<AuthLinksComponent />', () => {
  const resourceName = 'users';
  const currentUser = {isLoggedIn: false};
  const AuthLinksList = ({children}) => <ul>{children}</ul>;
  const AuthLinksListItem = ({path, route: {linkText}, location: {pathname}}) => {
    return <li><a href={path}>{linkText}</a></li>;
  };
  const location = {pathname: 'no-match'};

  it('should render list with 4 links', () => {
    initReactDevise();
    const component = mount(<AuthLinksComponent
      resourceName={resourceName}
      AuthLinksList={AuthLinksList}
      AuthLinksListItem={AuthLinksListItem}
      currentUser={currentUser}
      location={location}
    />);
    const tree = mountToJson(component);
    const list = tree.children[0].children[0];
    expect(list.type).toEqual('ul');
    [
      ['/users/login', 'Log In'],
      ['/users/sign-up', 'Sign Up'],
      ['/users/confirmation/new', 'Resend Confirmation Instructions'],
      ['/users/password/new', 'Reset Your Password']
    ].forEach(([path, text]) => {
      expect(list.children.some(listItem => {
        return (
          listItem.children[0].type === 'li' &&
          listItem.children[0].children[0].type === 'a' &&
          listItem.children[0].children[0].props.href === path &&
          listItem.children[0].children[0].children[0] === text
        );
      })).toBeTruthy();
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
    const component = mount(<AuthLinksComponent
      resourceName={resourceName}
      AuthLinksList={AuthLinksList}
      AuthLinksListItem={AuthLinksListItem}
      currentUser={currentUser}
      location={location}
    />);
    const tree = mountToJson(component);
    const list = tree.children[0].children[0];
    expect(list.children.some(listItem => {
      return (
        listItem.children[0].children[0].props.href === '/users/foo' &&
        listItem.children[0].children[0].children[0] === 'Foo Bar'
      );
    })).toBeTruthy();
  });
});
