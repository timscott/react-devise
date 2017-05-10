import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {requestResetPassword, formAction} from '../actions';

const RequestResetPasswordForm = reduxForm({
  form: 'requestResetPassword'
})(({handleSubmit, submitting, submitSucceeded, error, onSubmit, auth: {messages, viewPlugin: {renderInput, SubmitButton, Form, FormError}}}) => {
  if (submitSucceeded) {
    return <p>
      {messages.requestResetPasswordSucceeded}
    </p>;
  }
  return (
    <Form onSubmit={handleSubmit(formAction(onSubmit))}>
      <Field
        name="email"
        label="Email"
        component={renderInput}
      />
      <SubmitButton
        label={submitting ? 'Requesting Password Reset...' : 'Request Password Reset'}
        disabled={submitting}
      />
      {error && <FormError>{error}</FormError>}
    </Form>
  );
});

const RequestResetPassword = ({doRequestResetPassword, ...rest}) => {
  const {auth: {AuthLinks, viewPlugin: {View, Heading}}} = rest;
  return (
    <View>
      <Heading>
        Request Password Reset
      </Heading>
      <RequestResetPasswordForm onSubmit={doRequestResetPassword} {...rest} />
      <AuthLinks />
    </View>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    doRequestResetPassword: data => requestResetPassword(data, dispatch)
  };
};

const RequestResetPasswordContainer = connect(null, mapDispatchToProps)(RequestResetPassword);

export {
  RequestResetPasswordForm,
  RequestResetPassword,
  RequestResetPasswordContainer as default
};
