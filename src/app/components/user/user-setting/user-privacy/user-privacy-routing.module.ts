import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPrivacyComponent } from 'src/app/components/user/user-setting/user-privacy/user-privacy.component';

const routes: Routes = [{
  path: '',
  component: UserPrivacyComponent,
  data: {
    title: 'PRIVACY_SETTINGS',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPrivacyRoutingModule {
}
