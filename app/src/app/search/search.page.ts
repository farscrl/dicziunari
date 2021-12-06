import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ConfigService } from '../services/config.service';
import { IonContent, IonInfiniteScroll, IonSelect, ModalController } from '@ionic/angular';
import { Dictionary, SearchDirection } from 'src/data/search';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { Subscription } from 'rxjs';
import { SearchModeModalComponent } from './search-mode-modal/search-mode-modal.component';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) private content: IonContent;

  public searchString = '';
  public selectedDictionary: Dictionary;
  public searchDirection: SearchDirection;
  public pleds = [];

  private hasScrollbar = false;

  private dictionarySubscription: Subscription;
  private searchDirectionSubscription: Subscription;
  private searchModeSubscription: Subscription;

  constructor(private searchService: SearchService, private configService: ConfigService, private modalController: ModalController) { }

  ngOnInit() {
    this.selectedDictionary = this.configService.getSelectedDictionary();
    this.searchDirection = this.configService.getSearchDirection();
    this.dictionarySubscription = this.configService.getDictionaryObservable().subscribe((dictionary) => {
      this.selectedDictionary = dictionary;
      this.search();
    });
    this.searchDirectionSubscription = this.configService.getSearchDirectionObservable().subscribe((searchDirection) => {
      this.searchDirection = searchDirection;
      this.search();
    });
    this.searchModeSubscription = this.configService.getSearchModeObservable().subscribe((searchMode) => {
      this.search();
    });
  }

  ngOnDestroy(): void {
    this.dictionarySubscription.unsubscribe();
    this.searchDirectionSubscription.unsubscribe();
    this.searchModeSubscription.unsubscribe();
  }

  async changeDictionary() {
    const modal = await this.modalController.create({
      component: SearchModeModalComponent,
      cssClass: 'search-mode',
      componentProps: {
        'firstName': 'Douglas',
        'lastName': 'Adams',
        'middleInitial': 'N'
      }
    });
    return await modal.present();
  }

  search() {
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

  enterHit() {
    if (Capacitor.isNativePlatform()) {
      Keyboard.hide();
    }
  }

  loadMoreData() {
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
    // 100 is the height of the ion-infinite-scroll-content
    this.hasScrollbar = scrollElement.scrollHeight > scrollElement.clientHeight + 100;
  }
}
