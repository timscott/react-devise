import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {confirm, logout} from '../actions';
import url from 'url';

class Confirm extends Component {
  state = {
    confirming: true
  };
  componentDidMount() {
    const {query} = url.parse(this.props.location.search, true);
    return this.props.doConfirm(query.confirmation_token).then(response => {
      let newState = {
        confirming: false
      };
      if (response.ok) {
        this.setState(newState);
      } else if (response.status === 422) {
        response.json().then(errors => {
          const errorMessages = Object.keys(errors).reduce((result, field) => {
            result.push(errors[field].map(predicate => `${field} ${predicate}`));
            return result;
          }, []);
          this.setState({
            ...newState,
            errors: errorMessages
          });
        });
      }
    });
  }
  render() {
    if (this.state.confirming) {
      return <div>Confirming...</div>;
    }
    const {auth: {messages: {confirmSucceeded: confirmSucceededMessage, confirmContinueLinkText, confirmFailed: confirmFailedMessage}, formPlugin: {View, Heading, FormError}}} = this.props;
    if (this.state.errors) {
      const {auth: {AuthLinks}} = this.props;
      return (
        <div>
          <FormError>
            <p>{confirmFailedMessage}</p>
            <ul>
              {this.state.errors.map(error => <li key={error}>{error}</li>)}
            </ul>
          </FormError>
          <AuthLinks />
        </div>
      );
    }
    return (
      <View>
        <Heading>
          Confirmed
        </Heading>
        <p>{confirmSucceededMessage}</p>
        <Link to="/" >{confirmContinueLinkText}</Link>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    doConfirm: token => confirm(token, dispatch),
    doLogout: () => logout(dispatch)
  };
};

const ConfirmContainer = connect(mapStateToProps, mapDispatchToProps)(Confirm);

export {
  Confirm,
  ConfirmContainer as default
};
