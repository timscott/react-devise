import {SubmissionError} from 'redux-form';
import {ValidationError} from '../errors';

const formAction = action => {
  return data => action(data).catch(ValidationError, err => {
    // TODO: This will show only the first message per attribute.
    throw new SubmissionError(err.errors);
  });
};

export default formAction;
