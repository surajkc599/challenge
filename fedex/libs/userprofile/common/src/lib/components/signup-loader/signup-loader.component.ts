import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiCommonModule } from '@fedex/shared/ui-common';
import { RequestStatus } from '@fedex/userprofile/domain';

@Component({
  selector: 'fedex-signup-loader',
  standalone: true,
  imports: [CommonModule, UiCommonModule],
  templateUrl: './signup-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupLoaderComponent {
  @Input() status: RequestStatus | undefined;

  constructor() {
    this.status = RequestStatus.IDLE
  }
}
