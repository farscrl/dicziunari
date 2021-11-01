import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CopyService } from '../../../services/copy.service';
import { SearchDirection, Locale, Dictionary } from 'src/data/search';
import { Router } from '@angular/router';
import { ConfigService } from '../../../services/config.service';
import { FavouritesService } from '../../../services/favourites.service';
import { ToastService } from '../../../services/toast.service';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-lemma-display',
  templateUrl: './lemma-display.component.html',
  styleUrls: ['./lemma-display.component.scss'],
})
export class LemmaDisplayComponent implements OnInit {
  @Input()
  public lemma: any;

  @Input()
  public searchString: string;

  @Input()
  public searchDirection: SearchDirection = SearchDirection.both;

  @Input()
  public dictionary: Dictionary = Dictionary.rumgrischun;

  @Input()
  public isSaved = false;

  @Output()
  public changeSearchTerm = new EventEmitter<string>();

  @Output()
  public deleteItem = new EventEmitter<any>();

  public completeLemma: string;

  public selectedLocale: Locale = Locale.rm;

  constructor(
    private copyService: CopyService,
    private router: Router,
    private configService: ConfigService,
    private favouritesService: FavouritesService,
    private toastService: ToastService,
    private searchService: SearchService,
  ) {}

  ngOnInit() {
    console.log(this.lemma);
    this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });

    this.completeLemma = this.isSursilvan ? this.lemma.Corp : '';
  }

  goToDetail() {
    if (this.isSaved) {
      this.router.navigate(['/tabs/favourites/detail/' + this.lemma.id], { state: { data: this.lemma } });
    } else {
      this.router.navigate(['/tabs/search/detail/' + this.lemma.id]);
    }
  }

  async addFavorite() {
    this.searchService.getDetails(this.lemma.id).then(async (lemma) => {
      if (lemma.StichwortR) {
        lemma.RStichwort = lemma.StichwortR;
      }
      if (lemma.StichwortD) {
        lemma.DStichwort = lemma.StichwortD;
      }

      this.favouritesService.addFavorite(this.dictionary, lemma);
      console.log(lemma);
      await this.toastService.showNotification('SEARCH.RESULTS.COPIED');
    });
  }

  async copy() {
    this.copyService.copyItem(this.lemma.DStichwort, this.lemma.RStichwort);
  }

  async deleteFavourite() {
    this.favouritesService.deleteFavorite(this.lemma.id);
    this.deleteItem.emit(this.lemma);
    await this.toastService.showNotification('SEARCH.RESULTS.DELETED');
  }

  changeTerm(term: string) {
    this.changeSearchTerm.emit(term);
  }

  get isSursilvan() {
    return this.dictionary === Dictionary.sursilv;
  }

  get isVerb() {
    return !!this.lemma.preschentsing3;
  }
}
