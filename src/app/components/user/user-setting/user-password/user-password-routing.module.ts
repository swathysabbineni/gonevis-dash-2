import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPasswordComponent } from '@app/components/user/user-setting/user-password/user-password.component';

const routes: Routes = [{
  path: '',
  component: UserPasswordComponent,
  data: {
    title: 'PASSWORD_SETTINGS',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPasswordRoutingModule {
}
