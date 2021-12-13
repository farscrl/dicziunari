import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPage } from './search.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from './../shared/shared.module';
import { NoResultsComponent } from './no-results/no-results.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { SearchPageRoutingModule } from './search-routing.module';
import { SearchDetailPage } from './search-detail/search-detail.page';
import { SearchModeModalComponent } from './search-mode-modal/search-mode-modal.component';
import { DictionaryModalComponent } from './dictionary-modal/dictionary-modal.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, SearchPageRoutingModule, TranslateModule, SharedModule],
  declarations: [SearchPage, NoResultsComponent, PlaceholderComponent, SearchDetailPage, DictionaryModalComponent, SearchModeModalComponent],
})
export class SearchPageModule { }
