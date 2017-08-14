import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {editUser, updateUser, formAction} from '../actions';
import {required, email} from './validation';

// TODO: We are using updateNeedsConfirmationMessage because email is the only field on this form, so we're assuming the email was updated. Need a better way to handle this.

const UserForm = reduxForm({
  form: 'editUser'
})(({error, dirty, valid, submitting, submitSucceeded, handleSubmit, onSubmit, auth: {messages: {updateNeedsConfirmation: updateNeedsConfirmationMessage}, viewPlugin: {renderInput, SubmitButton, Form, FormError, FormSuccess}}}) => {
  return (
    <Form onSubmit={handleSubmit(formAction(onSubmit))}>
      <Field
        name="email"
        component={renderInput}
        label="Email"
        validate={[required, email]}
      />
      <SubmitButton
        label={submitting ? 'Updating...' : 'Update'}
        disabled={!dirty || !valid || submitting}
      />
      {error && <FormError>{error}</FormError>}
      {submitSucceeded && <FormSuccess>{updateNeedsConfirmationMessage}</FormSuccess>}
    </Form>
  );
});

class User extends Component {
  state = {}
  componentDidMount() {
    return editUser().then(response => {
      return response.json();
    }).then(data => {
      this.setState({
        initialValues: data
      });
    });
  }
  render() {
    const {doUpdateUser, ...rest} = this.props;
    const {auth: {viewPlugin: {View, Heading}}} = rest;
    return (
      <View>
        <Heading>
          User Profile
        </Heading>
        <UserForm
          initialValues={this.state.initialValues}
          onSubmit={doUpdateUser}
          {...rest}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    doUpdateUser: form => updateUser(form, dispatch)
  };
};

const UserContainer = connect(null, mapDispatchToProps)(User);

export {
  UserForm,
  User,
  UserContainer as default
};
