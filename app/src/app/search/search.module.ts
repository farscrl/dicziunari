import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPage } from './search.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { TranslateModule } from '@ngx-translate/core';
import { SearchResultComponent } from './search-result/search-result.component';
import { SharedModule } from './../shared/shared.module';
import { NoResultsComponent } from './no-results/no-results.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { SearchPageRoutingModule } from './search-routing.module';
import { SearchDetailPage } from './search-detail/search-detail.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SearchPageRoutingModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [SearchPage, SearchResultComponent, NoResultsComponent, PlaceholderComponent, SearchDetailPage],
})
export class SearchPageModule {}
