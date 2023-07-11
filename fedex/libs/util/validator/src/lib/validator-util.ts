// Validator name binded to Error Message
// Ideally this should have been i18n
const validatorMessages: Record<string, string> = {
  required: 'This field is required',
  email: 'Email must be a valid email address',
  pattern: 'Email must be a valid email address',
  minlength: 'Password must be at least 8 characters long',
  includelowerupperchar: 'Password should contain lower and uppercase letters',
  excludefirstlastname: 'Password should not contain first or last name',
};

export const getValidatorErrors = (
  validators: string[]
): Record<string, string> => {
  return validators.reduce(
    (acc, current) => ({ ...acc, [current]: validatorMessages[current] || '' }),
    {}
  );
};
