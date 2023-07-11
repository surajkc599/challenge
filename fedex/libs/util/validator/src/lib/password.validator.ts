import { AbstractControl } from '@angular/forms';
import { getValidatorErrors } from './validator-util';

/**
 * Keep all business logic related to password validation here.
 * This function should capture rules for validating password and set errors to form control.
 *
 * @param group - The form control group
 * @returns validation errors or null
 */
export const ValidatePassword = (group: AbstractControl) => {
  const { firstName, lastName, password } = group.value;
  const validatorErrorMessages = toValidatorErrorMessages(
    firstName,
    lastName,
    password
  );

  if (password.length) {
    // shows error message instantly as user types for password
    group.get('password')?.markAsTouched();
  }
  if (validatorErrorMessages) {
    group.get('password')?.setErrors(validatorErrorMessages);
  } else {
    group.get('password')?.setErrors(null);
  }

  return validatorErrorMessages;
};

/**
 * This function returns a record/map of validator corresponding to its error message
 * When null there are no error messages in password control
 *
 * @param firstName - user input first name
 * @param lastName - user input last name
 * @param password - user input password
 *
 * @returns
 */
export const toValidatorErrorMessages = (
  firstName: string,
  lastName: string,
  password: string
): Record<string, string> | null => {
  const isPasswordEmpty = password.length === 0;
  const isPasswordLessThan8Chars = password.length < 8;
  const isPasswordContainsLowerAndUpperCaseChars = /[A-Z][a-z]/.test(password);
  const lowerCasePassword = password.toLowerCase();
  const isPasswordContainsFirstOrLastName =
    lowerCasePassword.includes(firstName.toLowerCase()) ||
    lowerCasePassword.includes(lastName.toLowerCase());

  let validators: string[] = [];

  if (isPasswordEmpty) {
    validators = [...validators, 'required'];
  }
  if (isPasswordLessThan8Chars) {
    validators = [...validators, 'minlength'];
  }
  if (!isPasswordContainsLowerAndUpperCaseChars) {
    validators = [...validators, 'includelowerupperchar'];
  }
  if (isPasswordContainsFirstOrLastName) {
    validators = [...validators, 'excludefirstlastname'];
  }

  if (validators.length > 0) {
    const validatorErrors = getValidatorErrors(validators);

    return validatorErrors;
  }

  return null;
};
