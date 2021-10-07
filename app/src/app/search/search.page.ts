import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ConfigService } from '../services/config.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public lemma = '';
  public selectedDictionary;
  public searchDirection;
  public pleds = [];

  constructor(private searchService: SearchService, private configService: ConfigService) {}

  ngOnInit() {
    this.selectedDictionary = this.configService.getSelectedDictionary();
    this.searchDirection = this.configService.getSearchDirection();
  }

  search() {
    console.log('===> search');
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
    if (this.lemma === '') {
      this.pleds = [];
      return;
    }
    this.searchService.newSearch(this.lemma).then((pleds) => {
      this.pleds = pleds;
    });
  }

  loadMoreData() {
    console.log('===> loadMoreData', event);
    this.searchService.getNextResults().then((pleds) => {
      this.infiniteScroll.complete();
      if (pleds.length === 0) {
        this.infiniteScroll.disabled = true;
      }
      this.pleds.push(...pleds);
    });
  }

  dictionaryChanged(value) {
    this.configService.setSelectedDictionary(value.detail.value);
    this.search();
  }

  changeSearchDirection() {
    switch (this.searchDirection) {
      case 'fromDe':
        this.configService.setSearchDirection('fromRm');
        this.searchDirection = this.configService.getSearchDirection();
        break;
      case 'fromRm':
        this.configService.setSearchDirection('both');
        this.searchDirection = this.configService.getSearchDirection();
        break;
      case 'both':
      default:
        this.configService.setSearchDirection('fromDe');
        this.searchDirection = this.configService.getSearchDirection();
        break;
    }
    this.search();
  }
}
