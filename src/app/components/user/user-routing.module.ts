import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousGuardService } from '@app/services/anonymous-guard/anonymous-guard.service';
import { AuthGuardService } from '@app/services/auth-guard/auth-guard.service';
import { UserComponent } from './user.component';

const routes: Routes = [{
  path: '',
  component: UserComponent,
  data: {
    title: 'User',
  },
  children: [{
    path: 'setting',
    loadChildren: () => import('./user-setting/user-setting.module').then(m => m.UserSettingModule),
    canLoad: [AuthGuardService],
  }, {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule),
    canLoad: [AnonymousGuardService],
  }, {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule),
    canLoad: [AnonymousGuardService],
  }, {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
  }, {
    path: 'reset-password/:token',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule),
  }, {
    path: 'email-confirmation/:token',
    loadChildren: () => import('./email-confirmation/email-confirmation.module').then(m => m.EmailConfirmationModule),
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
