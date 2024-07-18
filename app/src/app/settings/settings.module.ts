import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SettingsPage } from './settings.page';

import { SettingsPageRoutingModule } from './settings-routing.module';
import { FeedbackPage } from './feedback/feedback.page';
import { HelpPage } from './help/help.page';
import { InfoPage } from './info/info.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SettingsPage }]),
    SettingsPageRoutingModule,
    SharedModule,
  ],
  declarations: [SettingsPage, FeedbackPage, HelpPage, InfoPage],
})
export class SettingsPageModule {}
