import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavouritesPage } from './favourites.page';
import { FavouritesDetailPage } from './favourites-detail/favourites-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FavouritesPage,
  },
  {
    path: 'detail/:id',
    component: FavouritesDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouritesPageRoutingModule {}
