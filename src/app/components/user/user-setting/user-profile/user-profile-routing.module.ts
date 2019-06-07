import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from '@app/components/user/user-setting/user-profile/user-profile.component';

const routes: Routes = [{
  path: '',
  component: UserProfileComponent,
  data: {
    title: 'PROFILE_SETTINGS',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule {
}
