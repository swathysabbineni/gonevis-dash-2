import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from '@app/components/user/reset-password/reset-password.component';

const routes: Routes = [{
  path: '',
  component: ResetPasswordComponent, data: {
    title: 'Reset Password',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordRoutingModule {
}
