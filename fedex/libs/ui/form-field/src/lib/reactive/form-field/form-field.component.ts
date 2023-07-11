import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UiCommonModule } from '@fedex/shared/ui-common';
import { getValidatorErrors } from '@fedex/util/validator';

@Component({
  selector: 'fedex-reactive-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiCommonModule],
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactiveFormFieldComponent {
  @Input() control!: FormControl;
  @Input() type = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() name = '';

  get errorMessage() {
    const errors = this.control?.errors;
    const validatorErrors = getValidatorErrors(Object.keys(errors || []));
    const errorMessages = Object.values(validatorErrors);
    return errorMessages.length ? errorMessages[0] : '';
  }
}
