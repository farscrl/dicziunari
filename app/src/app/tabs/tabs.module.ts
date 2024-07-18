import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TabsPageRoutingModule, SharedModule],
  declarations: [TabsPage],
})
export class TabsPageModule {}
