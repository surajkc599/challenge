import { AbstractControl } from '@angular/forms';
import { getValidatorErrors } from './validator-util';

/**
 * Validator function that checks if entered email address is valid or not
 *
 * @param group - Form control group
 * @returns validation errors or null
 */
export const SimpleEmailValidator = (group: AbstractControl) => {
  const { email } = group.value;
  const validatorErrorMessages = toValidatorErrorMessages(email);

  if (email.length) {
    // shows error message instantly as user types for email
    group.get('email')?.markAsTouched();
  }

  if (validatorErrorMessages) {
    group.get('email')?.setErrors(validatorErrorMessages);
  } else {
    group.get('email')?.setErrors(null);
  }

  return validatorErrorMessages;
};

const toValidatorErrorMessages = (email: string) => {
  const isEmailEmpty = email.length === 0;
  let validators: string[] = [];

  // Validating email address is not simple and straight forward.
  // It depends on to what extent do you want to support it, depends on use case and organization.
  // At this point I do not want to make it complex and make code unreadable.
  // I would actually chose any third party api which actually validates the email address if really situation demands rather
  // than we implementing it. So for now I would settle for a mediocre solution with a simple/standard regex.
  const regexPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  if (isEmailEmpty) {
    validators = [...validators, 'required'];
  }
  if (!email.match(regexPattern)) {
    validators = [...validators, 'email'];
  }

  if (validators.length > 0) {
    const validatorErrors = getValidatorErrors(validators);

    return validatorErrors;
  }

  return null;
};
