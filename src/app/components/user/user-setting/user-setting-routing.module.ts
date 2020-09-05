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
    loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
  }, {
    path: 'password',
    loadChildren: () => import('./user-password/user-password.module').then(m => m.UserPasswordModule),
  }, {
    path: 'privacy',
    loadChildren: () => import('./user-privacy/user-privacy.module').then(m => m.UserPrivacyModule),
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
