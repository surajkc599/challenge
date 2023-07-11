import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordValidatorDirective } from './password.validator.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [PasswordValidatorDirective],
  exports: [PasswordValidatorDirective],
})
export class UtilDirectiveModule {}
