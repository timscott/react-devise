import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {Redirect} from 'react-router-dom';
import url from 'url';
import {resetPassword, formAction} from '../actions';

const ResetPasswordForm = reduxForm({
  form: 'requestResetPassword'
})(({handleSubmit, submitting, error, onSubmit, query, submitSucceeded, auth: {resourceName, messages, formPlugin: {renderInput, SubmitButton, Form, FormError}}}) => {
  const submitWithQuery = form => {
    return onSubmit({
      ...form,
      ...query
    });
  };
  if (submitSucceeded) {
    return <Redirect to={`/${resourceName}/login`} />;
  }
  return (
    <Form onSubmit={handleSubmit(formAction(submitWithQuery))}>
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
        label={submitting ? 'Resetting Password...' : 'Reset Password'}
        disabled={submitting}
      />
      {error && <FormError>{error}</FormError>}
    </Form>
  );
});

const ResetPassword = ({doResetPassword, location, ...rest}) => {
  const {query} = url.parse(location.search, true);
  const {auth: {AuthLinks, formPlugin: {View, Heading}}} = rest;
  return (
    <View>
      <Heading>
        Reset Password
      </Heading>
      <ResetPasswordForm onSubmit={doResetPassword} query={query} {...rest} />
      <AuthLinks />
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    doResetPassword: form => resetPassword(form, dispatch)
  };
};

const ResetPasswordContainer = connect(null, mapDispatchToProps)(ResetPassword);

export {
  ResetPasswordForm,
  ResetPassword,
  ResetPasswordContainer as default
};
