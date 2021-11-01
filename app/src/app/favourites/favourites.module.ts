import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavouritesPage } from './favourites.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { FavouritesDetailPage } from './favourites-detail/favourites-detail.page';
import { NoFavouritesComponent } from './no-favourites/no-favourites.component';

import { FavouritesPageRoutingModule } from './favourites-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, FavouritesPageRoutingModule, TranslateModule, SharedModule],
  declarations: [FavouritesPage, FavouritesDetailPage, NoFavouritesComponent],
})
export class FavouritesPageModule {}
