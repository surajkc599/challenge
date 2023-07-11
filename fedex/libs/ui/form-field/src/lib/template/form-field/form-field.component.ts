import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormsModule, NgForm, NgModel } from '@angular/forms';
import { UiCommonModule } from '@fedex/shared/ui-common';
import { UtilDirectiveModule } from '@fedex/util/directive';
import { getValidatorErrors } from '@fedex/util/validator';

@Component({
  selector: 'fedex-template-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule, UiCommonModule, UtilDirectiveModule],
  templateUrl: './form-field.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateFormFieldComponent {
  @Input() signalModel: WritableSignal<string> = signal('');
  @Input() type = 'text';
  @Input() name = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() pattern = '';
  // These are required for Password validator
  @Input() userFirstName?: string = '';
  @Input() userLastName?: string = '';

  errorMessage(control: NgModel) {
    const validators = control.errors || {};
    const validatorMessages = getValidatorErrors(Object.keys(validators));
    return validatorMessages;
  }
}
