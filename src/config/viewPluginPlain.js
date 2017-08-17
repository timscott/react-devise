import React from 'react';
import {Link} from 'react-router-dom';

const plugin = ({
  formProps = {
    className: 'auth-form'
  },
  formErrorProps = {
    className: 'auth-error',
    style: {
      marginTop: '5px',
      color: 'red'
    }
  },
  formSuccessProps = {
    className: 'auth-success',
    style: {
      marginTop: '5px',
      color: 'green'
    }
  },
  fieldErrorProps = {
    className: 'auth-field-error',
    style: {
      color: 'red'
    }
  },
  fieldWarningProps = {
    className: 'auth-field-warning',
    style: {
      color: 'amber'
    }
  },
  alertProps = {
    className: 'auth-alert'
  },
  authLinksListProps = {
    className: 'auth-links'
  },
  authLinksListItemProps = {
    className: 'auth-link-item'
  },
  headingProps = {
    className: 'auth-view-heading'
  },
  viewProps = {
    className: 'auth-view'
  }
} = {}) => {
  const renderInput = ({input, label, type, meta: {touched, error, warning}}) => (
    <div>
      <label>{label}</label>
      <div>
        <input {...input} placeholder={label} type={type}/>
        {touched && ((error && <span {...fieldErrorProps}>{error}</span>) || (warning && <span {...fieldWarningProps}>{warning}</span>))}
      </div>
    </div>
  );
  const SubmitButton = ({label, disabled}) => (
    <input
      type="submit"
      value={label}
      disabled={disabled}
    />
  );
  const Form = ({onSubmit, children}) => {
    return <form onSubmit={onSubmit} {...formProps}>{children}</form>;
  };
  const FormSuccess = ({children}) => {
    return <div {...formSuccessProps}>{children}</div>;
  };
  const Alert = ({children}) => {
    return <div {...alertProps}>{children}</div>;
  };
  const FormError = ({children}) => {
    return <div {...formErrorProps}>{children}</div>;
  };
  const AuthLinksList = ({children}) => {
    return <ul {...authLinksListProps}>{children}</ul>;
  };
  const AuthLinksListItem = ({path, route: {linkText}, location: {pathname}}) => {
    if (path === pathname) {
      return null;
    }
    return <li {...authLinksListItemProps}><Link to={path}>{linkText}</Link></li>;
  };
  const Heading = ({children}) => {
    return <h1 {...headingProps}>{children}</h1>;
  };
  const View = ({children}) => {
    return <div {...viewProps}>{children}</div>;
  };
  return {
    renderInput,
    SubmitButton,
    Form,
    FormSuccess,
    Alert,
    FormError,
    AuthLinksList,
    AuthLinksListItem,
    Heading,
    View
  };
};

export default {
  plugin
};
