import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PortalModule } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { KeyManagerComponent } from '@app/components/dash/write/core/key-manager.component';
import { FileSelectionModule } from '@app/shared/file-selection/file-selection.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { QuillModule } from 'ngx-quill';
import { FocusableOptionDirective } from './core/focusable-option.directive';

import { WriteRoutingModule } from './write-routing.module';
import { WriteComponent } from './write.component';
import { ShortcutsComponent } from './shared/components/shortcuts/shortcuts.component';


@NgModule({
  declarations: [
    WriteComponent,
    FocusableOptionDirective,
    KeyManagerComponent,
    ShortcutsComponent,
  ],
  imports: [
    CommonModule,
    WriteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    QuillModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    TextFieldModule,
    FontAwesomeModule,
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
    MatProgressSpinnerModule,
  ],
})
export class WriteModule {
}
