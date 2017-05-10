import React from 'react';
import {connect} from 'react-redux';
import {login} from '../actions';
import {UnauthorizedError} from '../errors';
import {Redirect} from 'react-router-dom';
import {reduxForm, Field, SubmissionError} from 'redux-form';

const LoginForm = reduxForm({
  form: 'login'
})(({handleSubmit, submitting, error, onSubmit, auth: {messages, viewPlugin: {renderInput, SubmitButton, Form, FormError}}}) => {
  const submit = data => {
    return onSubmit(data).catch(UnauthorizedError, () => {
      throw new SubmissionError({
        _error: messages.loginFailed
      });
    });
  };
  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Field
        name="email"
        component={renderInput}
        label="Email"
      />
      <Field
        name="password"
        type="password"
        component={renderInput}
        label="Password"
      />
      <SubmitButton
        label={submitting ? 'Logging In...' : 'Log In'}
        disabled={submitting}
      />
      {error && <FormError>{error}</FormError>}
    </Form>
  );
});

const Login = ({currentUser, doLogin, location: {state: {alert, from: {pathname: returnTo} = {}} = {}} = {}, ...rest} = {}) => {
  const submit = data => {
    return doLogin(data);
  };
  if (currentUser) {
    if (currentUser.isLoggedIn) {
      return <Redirect to={returnTo || '/'} />;
    }
  }
  const {auth: {AuthLinks, viewPlugin: {View, Heading, Alert}}} = rest;
  return (
    <View>
      <Heading>
        Login
      </Heading>
      {alert && <Alert>{alert}</Alert>}
      <LoginForm onSubmit={submit} {...rest} />
      <AuthLinks />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doLogin: data => login(data, dispatch)
  };
};

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export {
  Login,
  LoginContainer as default
};
