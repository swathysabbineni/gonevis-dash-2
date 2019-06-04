import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';

const routes: Routes = [{
  path: '',
  component: UserComponent,
  data: {
    title: 'User',
  },
  children: [{
    path: 'setting',
    loadChildren: './user-setting/user-setting.module#UserSettingModule',
  }, {
    path: 'sign-in',
    loadChildren: './sign-in/sign-in.module#SignInModule',
  }, {
    path: 'sign-up',
    loadChildren: './sign-up/sign-up.module#SignUpModule',
  }, {
    path: 'forgot-password',
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule',
  }, {
    path: 'reset-password/:token',
    loadChildren: './reset-password/reset-password.module#ResetPasswordModule',
  }, {
    path: '',
    redirectTo: 'setting',
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}
