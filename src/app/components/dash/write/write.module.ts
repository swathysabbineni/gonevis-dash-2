import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PortalModule } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { KeyManagerComponent } from '@app/components/dash/write/core/key-manager.component';
import { FileSelectionModule } from '@app/shared/file-selection/file-selection.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { AutosizeModule } from 'ngx-autosize';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { QuillModule } from 'ngx-quill';
import { FocusableOptionDirective } from './core/focusable-option.directive';

import { WriteRoutingModule } from './write-routing.module';
import { WriteComponent } from './write.component';


@NgModule({
  declarations: [
    WriteComponent,
    FocusableOptionDirective,
    KeyManagerComponent,
  ],
  imports: [
    CommonModule,
    WriteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    QuillModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    TextFieldModule,
    FontAwesomeModule,
    AutosizeModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    FileSelectionModule,
    A11yModule,
    PortalModule,
    ClipboardModule,
    MatSidenavModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class WriteModule {
}
