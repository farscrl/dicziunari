import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CopyService } from '../../services/copy.service';
import { SearchDirection, Locale, Dictionary } from 'src/data/search';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { FavouritesService } from '../../services/favourites.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input()
  public lemma: any;

  @Input()
  public lemmaId: string;

  @Input()
  public lemmaD: string;

  @Input()
  public lemmaR: string;

  @Input()
  public completeLemma: string;

  @Input()
  public isVerb: boolean;

  @Input()
  public searchString: string;

  @Input()
  public searchDirection: SearchDirection = SearchDirection.both;

  @Input()
  public isSursilvan: boolean;

  @Output()
  public changeSearchTerm = new EventEmitter<string>();

  public selectedLocale: Locale = Locale.rm;

  private selectedDictionary: Dictionary = Dictionary.rumgrischun;

  constructor(
    private copyService: CopyService,
    private router: Router,
    private configService: ConfigService,
    private favouritesService: FavouritesService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });
    this.configService.getDictionaryObservable().subscribe((dictionary) => {
      this.selectedDictionary = dictionary;
    });
  }

  goToDetail() {
    this.router.navigate(['/tabs/search/detail/' + this.lemmaId]);
  }

  async addFavorite() {
    this.favouritesService.addFavorite(this.selectedDictionary, this.lemma);
    await this.toastService.showNotification('SEARCH.RESULTS.COPIED');
  }

  async copy() {
    this.copyService.copyItem(this.lemmaD, this.lemmaR);
  }

  changeTerm(term: string) {
    this.changeSearchTerm.emit(term);
  }
}
