import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiCommonModule } from '@fedex/shared/ui-common';
import { IRouteMetadata } from '@fedex/shared/registry';

@Component({
  selector: 'fedex-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, UiCommonModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  @Input() routesMetadata: IRouteMetadata[] = [];
}
