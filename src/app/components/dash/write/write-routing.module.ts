import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import Quill from 'quill';

import { WriteComponent } from './write.component';

@Injectable({ providedIn: 'root' })
export class HighlightJsResolver implements Resolve<boolean> {
  constructor() {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    /**
     * Wait until HighlightJs imports and modifies Quill's Syntax module and finally return true
     * to resolve
     */
    return import('highlight.js').then((highlightModule: { default: { highlightAuto: any; } }): boolean => {
      /**
       * Import Syntax module from Quill
       *
       * @see Quill.import
       */
      const Syntax = Quill.import('modules/syntax');
      /**
       * Change Syntax module's highlight to use HighlightJs
       */
      Syntax.DEFAULTS = {
        highlight: (text: string): string => {
          const result = highlightModule.default.highlightAuto(text);
          return result.value;
        },
      };
      /**
       * Resolve
       */
      return true;
    });
  }
}

const routes: Routes = [{
  path: ':id',
  component: WriteComponent,
  resolve: {
    highlightJs: HighlightJsResolver,
  },
  data: {
    editor: true,
  },
}, {
  path: '',
  redirectTo: 'new',
  pathMatch: 'full',
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriteRoutingModule {
}
