import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailConfirmationComponent } from '@app/components/user/email-confirmation/email-confirmation.component';

const routes: Routes = [{
  path: '',
  component: EmailConfirmationComponent,
  data: {
    title: 'EMAIL_CONFIRMATION',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailConfirmationRoutingModule {
}
