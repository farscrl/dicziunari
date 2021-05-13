import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavouritesPage } from './favourites.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { TranslateModule } from '@ngx-translate/core';

import { FavouritesPageRoutingModule } from './favourites-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FavouritesPageRoutingModule,
    TranslateModule,
  ],
  declarations: [FavouritesPage]
})
export class FavouritesPageModule {}
