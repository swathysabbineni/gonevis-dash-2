import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from '@app/components/user/forgot-password/forgot-password.component';

const routes: Routes = [{
  path: '',
  component: ForgotPasswordComponent,
  data: {
    title: 'FORGOT_PASSWORD_TITLE',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordRoutingModule {
}
