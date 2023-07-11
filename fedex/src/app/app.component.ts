import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiCommonModule } from '@fedex/shared/ui-common';
import { HttpClientModule } from '@angular/common/http';
import { ApiResourceService } from '@fedex/shared/api-resource';
import {
  PhotosDataService,
  UserProfileFacade,
  UsersDataService,
} from '@fedex/userprofile/domain';
import { LayoutComponent } from '@fedex/ui/layout';
import { IRouteMetadata, navRoutesMetadata } from '@fedex/shared/registry';

@Component({
  standalone: true,
  imports: [RouterModule, LayoutComponent, UiCommonModule, HttpClientModule],
  providers: [
    ApiResourceService,
    UserProfileFacade,
    PhotosDataService,
    UsersDataService,
  ],
  selector: 'fedex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  routes: IRouteMetadata[] = navRoutesMetadata;
}
