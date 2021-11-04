import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ConfigService } from '../services/config.service';
import { IonContent, IonInfiniteScroll, IonSelect } from '@ionic/angular';
import { Dictionary, SearchDirection } from 'src/data/search';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSelect, { static: false }) dictionarySelect: IonSelect;
  @ViewChild(IonContent, { static: false }) private content: IonContent;

  public searchString = '';
  public selectedDictionary: Dictionary;
  public searchDirection: SearchDirection;
  public pleds = [];

  private hasScrollbar = false;

  constructor(private searchService: SearchService, private configService: ConfigService) {}

  ngOnInit() {
    this.selectedDictionary = this.configService.getSelectedDictionary();
    this.searchDirection = this.configService.getSearchDirection();
    this.configService.getDictionaryObservable().subscribe((dictionary) => {
      this.selectedDictionary = dictionary;
      this.search();
    });
    this.configService.getSearchDirectionObservable().subscribe((searchDirection) => {
      this.searchDirection = searchDirection;
      this.search();
    });
    this.configService.getSearchModeObservable().subscribe((searchMode) => {
      this.search();
    });
  }

  changeDictionary() {
    this.dictionarySelect.open();
  }

  search() {
    console.log('===> search');
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
    if (this.searchString === '') {
      this.pleds = [];
      return;
    }
    this.searchService.newSearch(this.searchString).then(async (pleds) => {
      this.pleds = pleds;
      this.checkIfScreenIsFull();
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

      if (pleds.length > 0) {
        this.checkIfScreenIsFull();
      }
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

  changeSearchTerm(term: string) {
    this.searchString = term;
    this.search();
  }

  checkIfScreenIsFull() {
    const that = this;
    window.setTimeout(async () => {
      await that.checkForScrollbar();
      if (!that.hasScrollbar) {
        that.loadMoreData();
      }
    }, 1);
  }

  async checkForScrollbar() {
    const scrollElement = await this.content.getScrollElement();
    this.hasScrollbar = scrollElement.scrollHeight > scrollElement.clientHeight;
  }
}
