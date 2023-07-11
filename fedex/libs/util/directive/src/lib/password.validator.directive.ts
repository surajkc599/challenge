import {
  Validator,
  NG_VALIDATORS,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { toValidatorErrorMessages } from '@fedex/util/validator';

@Directive({
  selector: '[fedexPasswordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  @Input() controlName = '';
  @Input() userFirstName? = '';
  @Input() userLastName? = '';

  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (password?.length) {
      control.markAsTouched();
    }

    if (this.controlName === 'userPassword') {
      const firstValidatorErrorMessage = toFirstValidatorMessage(
        password,
        this.userFirstName,
        this.userLastName
      );
      const hasError = !!Object.keys(firstValidatorErrorMessage).length;

      if (hasError) {
        control.setErrors(firstValidatorErrorMessage);
        return firstValidatorErrorMessage;
      }

      control.setErrors(null);
      return null;
    }

    return null;
  }
}

const toFirstValidatorMessage = (
  password: string,
  userFirstName: string = '',
  userLastName: string = ''
) => {
  const validatorErrorMessages =
    toValidatorErrorMessages(
      userFirstName || '',
      userLastName || '',
      password || ''
    ) || {};

  const validators = Object.keys(validatorErrorMessages || []);
  if (validators.length) {
    const firstValidator = validators[0];
    const firstValidatorErrorMessage = {
      [firstValidator]: validatorErrorMessages[firstValidator],
    };

    return firstValidatorErrorMessage;
  }

  return {};
};
