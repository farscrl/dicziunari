import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavouritesPage } from './favourites.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { TranslateModule } from '@ngx-translate/core';
import { FavouriteItemComponent } from './favourite-item/favourite-item.component';
import { SharedModule } from '../shared/shared.module';

import { FavouritesPageRoutingModule } from './favourites-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FavouritesPageRoutingModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [FavouritesPage, FavouriteItemComponent],
})
export class FavouritesPageModule {}
