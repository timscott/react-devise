import ExtendableError from 'es6-error';

export default class ValidationError extends ExtendableError {
  constructor(errors) {
    super();
    this.errors = errors;
    this.name = 'ValidationError';
  }
}
