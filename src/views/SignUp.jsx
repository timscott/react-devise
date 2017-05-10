import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {Redirect} from 'react-router-dom';
import {signUp, formAction} from '../actions';

const SignUpForm = reduxForm({
  form: 'signUp'
})(({error, submitting, submitSucceeded, handleSubmit, onSubmit, auth: {messages: {signUpSucceeded: signUpSucceededMessage}, formPlugin: {renderInput, SubmitButton, Form, FormError}}}) => {
  if (submitSucceeded) {
    return <Redirect to={{
      pathname: '/',
      state: {
        notice: signUpSucceededMessage
      }}}
    />;
  }
  return (
    <Form onSubmit={handleSubmit(formAction(onSubmit))}>
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
      <Field
        name="password_confirmation"
        type="password"
        component={renderInput}
        label="Password Again"
      />
      <SubmitButton
        label={submitting ? 'Signing Up...' : 'Sign Up'}
        disabled={submitting}
      />
      {error && <FormError>{error}</FormError>}
    </Form>
  );
});

const SignUp = ({doSignUp, ...rest}) => {
  const {auth: {AuthLinks, formPlugin: {View, Heading}}} = rest;
  return (
    <View>
      <Heading>
        Sign Up
      </Heading>
      <SignUpForm onSubmit={doSignUp} {...rest} />
      <AuthLinks />
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    doSignUp: form => signUp(form, dispatch)
  };
};

const SignUpContainer = connect(null, mapDispatchToProps)(SignUp);

export {
  SignUpForm,
  SignUp,
  SignUpContainer as default
};
