const isPresent = value => value !== undefined && value !== null;

export const required = value => {
  return isPresent(value) ? undefined : 'Required';
};
export const email = value => {
  return isPresent(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined;
};
