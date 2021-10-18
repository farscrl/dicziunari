import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ConfigService } from '../services/config.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Dictionary, SearchDirection } from 'src/data/search';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public lemma = '';
  public selectedDictionary: Dictionary;
  public searchDirection: SearchDirection;
  public pleds = [];

  constructor(private searchService: SearchService, private configService: ConfigService) {}

  ngOnInit() {
    this.selectedDictionary = this.configService.getSelectedDictionary();
    this.searchDirection = this.configService.getSearchDirection();
    this.configService.getDictionaryObservable().subscribe((dictionary) => {
      this.search();
    });
    this.configService.getSearchDirectionObservable().subscribe((searchDirection) => {
      this.search();
    });
    this.configService.getSearchModeObservable().subscribe((searchMode) => {
      this.search();
    });
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
  }

  changeSearchDirection() {
    switch (this.searchDirection) {
      case SearchDirection.fromDe:
        this.configService.setSearchDirection(SearchDirection.fromRm);
        this.searchDirection = this.configService.getSearchDirection();
        break;
      case SearchDirection.fromRm:
        this.configService.setSearchDirection(SearchDirection.both);
        this.searchDirection = this.configService.getSearchDirection();
        break;
      case SearchDirection.both:
      default:
        this.configService.setSearchDirection(SearchDirection.fromDe);
        this.searchDirection = this.configService.getSearchDirection();
        break;
    }
  }

  get isSursilvan() {
    return this.selectedDictionary === Dictionary.sursilv;
  }
}
