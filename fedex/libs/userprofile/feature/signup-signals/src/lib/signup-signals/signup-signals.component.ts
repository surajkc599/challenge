import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  Optional,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormsModule, NgForm } from '@angular/forms';
import { catchError, tap } from 'rxjs';
import { UiCommonModule } from '@fedex/shared/ui-common';
import { TemplateFormFieldComponent } from '@fedex/ui/form-field';
import {
  RequestStatus,
  UserProfileFacade,
  UserStatus,
} from '@fedex/userprofile/domain';
import {
  SignupConfirmationComponent,
  SignupLoaderComponent,
} from '@fedex/userprofile/common';

@Component({
  selector: 'fedex-signup-signals',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UiCommonModule,
    TemplateFormFieldComponent,
    SignupConfirmationComponent,
    SignupLoaderComponent,
  ],
  templateUrl: './signup-signals.component.html',
  styleUrls: ['./signup-signals.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      deps: [[Optional, NgForm]],
      useFactory: (ngForm: NgForm) => ngForm,
    },
  ],
})
export class SignupSignalsComponent {
  public signupStatus: UserStatus;
  public firstName = signal('');
  public lastName = signal('');
  public email = signal('');
  public password = signal('');

  private userProfileFacade = inject(UserProfileFacade);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.signupStatus = { data: null, status: RequestStatus.IDLE};
  }

  // Computation for full name
  public fullName = computed(() => `${this.firstName()} , ${this.lastName()}`);

  onSignup = () => {
    this.userProfileFacade
      .signUpUser({
        firstName: this.firstName(),
        lastName: this.lastName(),
        email: this.email(),
      }).pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((value) => (this.signupStatus = value)),
        // Handle Error thrown from Interceptor
        catchError((error) => (this.signupStatus = error))
      )
      .subscribe();
  };
}
