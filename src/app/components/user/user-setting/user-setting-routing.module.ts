import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSettingComponent } from './user-setting.component';

const routes: Routes = [{
  path: '',
  component: UserSettingComponent,
  data: {
    title: 'USER_SETTINGS',
  },
  children: [{
    path: 'profile',
    loadChildren: './user-profile/user-profile.module#UserProfileModule',
  }, {
    path: 'password',
    loadChildren: './user-password/user-password.module#UserPasswordModule',
  }, {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSettingRoutingModule {
}
