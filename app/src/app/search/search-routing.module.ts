import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPage } from './search.page';
import { SearchDetailPage } from './search-detail/search-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SearchPage,
  },
  {
    path: 'detail/:id',
    component: SearchDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchPageRoutingModule {}
