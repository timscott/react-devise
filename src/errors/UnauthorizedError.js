import ExtendableError from 'es6-error';

export default class UnauthorizedError extends ExtendableError {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}
