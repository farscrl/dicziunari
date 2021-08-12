import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguageSelectionPage } from './language-selection.page';

const routes: Routes = [
  {
    path: '',
    component: LanguageSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LanguageSelectionPageRoutingModule {}
