import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { catchError, combineLatest, map, Observable, of, startWith, tap } from 'rxjs';
import { UiCommonModule } from '@fedex/shared/ui-common';
import { ValidatePassword, SimpleEmailValidator } from '@fedex/util/validator';
import { ReactiveFormFieldComponent } from '@fedex/ui/form-field';
import {
  UserProfileFacade,
  IUser,
  UserStatus,
  RequestStatus,
} from '@fedex/userprofile/domain';
import {
  SignupConfirmationComponent,
  SignupLoaderComponent,
} from '@fedex/userprofile/common';

const INITIAL_VALUE = '';
const FIELDS = ['firstName', 'lastName', 'email', 'password'];

@Component({
  selector: 'fedex-signup-reactiveform',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiCommonModule,
    ReactiveFormFieldComponent,
    SignupLoaderComponent,
    SignupConfirmationComponent,
  ],
  templateUrl: './signup-reactiveform.component.html',
})
export class SignupReactiveformComponent implements OnInit {
  public signupForm: FormGroup;
  public signupStatus: UserStatus;
  public fullName$: Observable<string>;

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  // Orchestrator
  private userProfileFacade = inject(UserProfileFacade);

  constructor() {
    // Create form fields with initial value and required validator
    const formFields: Record<string, [string, ValidationErrors]> =
      FIELDS.reduce((acc, current) => {
        return { ...acc, [current]: [INITIAL_VALUE, Validators.required] };
      }, {});
    this.signupForm = this.fb.group(formFields, {
      validators: [ValidatePassword, SimpleEmailValidator],
    });
    this.fullName$ = of('');
    this.signupStatus = { data: null, status: RequestStatus.IDLE };
  }

  /**
   * Listen to changes on firstname, lastname and form full name
   */
  ngOnInit() {
    const firstName$ = this.getFormControl('firstName').valueChanges;
    const lastName$ = this.getFormControl('lastName').valueChanges;
    // React to changes of first name and last name
    this.fullName$ = combineLatest([
      firstName$.pipe(startWith(INITIAL_VALUE)),
      lastName$.pipe(startWith(INITIAL_VALUE)),
    ]).pipe(map(([firstName, lastName]) => `${firstName}, ${lastName}`));
  }

  getFormControl = (controlName: string) =>
    this.signupForm.get(controlName) as FormControl;

  onSignup(user: IUser) {
    const { firstName, lastName, email } = user;
    // An observable stream of signup response
    this.userProfileFacade.signUpUser({
      firstName,
      lastName,
      email,
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((value) => (this.signupStatus = value)),
      // Handle Error thrown from Interceptor
      catchError((error) => (this.signupStatus = error))
    )
    .subscribe();
  }
}
