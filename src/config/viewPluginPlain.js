import React from 'react';

const plugin = ({
  formProps = {
    className: 'auth-form'
  },
  formErrorProps = {
    className: 'auth-error',
    style: {
      color: 'red'
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
  const Alert = ({children}) => {
    return <div {...alertProps}>{children}</div>;
  };
  const FormError = ({children}) => {
    return <div {...formErrorProps}>{children}</div>;
  };
  const AuthLinksList = ({children}) => {
    return <ul {...authLinksListProps}>{children}</ul>;
  };
  const AuthLinksListItem = ({children}) => {
    return <li {...authLinksListItemProps}>{children}</li>;
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
