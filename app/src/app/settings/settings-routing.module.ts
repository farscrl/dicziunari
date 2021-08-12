import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackPage } from './feedback/feedback.page';
import { HelpPage } from './help/help.page';
import { SettingsPage } from './settings.page';
import { InfoPage } from './info/info.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
  },
  {
    path: 'feedback',
    component: FeedbackPage,
  },
  {
    path: 'help',
    component: HelpPage,
  },
  {
    path: 'info',
    component: InfoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
