import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCommonModule } from '@fedex/shared/ui-common';
import { RequestStatus, UserStatus } from '@fedex/userprofile/domain';

@Component({
  selector: 'fedex-signup-confirmation',
  standalone: true,
  imports: [CommonModule, UiCommonModule],
  templateUrl: './signup-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupConfirmationComponent {
  @Input() signupStatus: UserStatus | null;
  @Input() fullName: string | null;

  constructor() {
    this.signupStatus = {
      data: null,
      status: RequestStatus.IDLE
    };
    this.fullName = '';
  }
}
