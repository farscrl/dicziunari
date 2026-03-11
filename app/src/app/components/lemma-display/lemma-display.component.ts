import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, inject } from '@angular/core';
import { CopyService } from '../../services/copy.service';
import { SearchDirection, Locale, Dictionary } from 'src/data/search';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { FavouritesService } from '../../services/favourites.service';
import { ToastService } from '../../services/toast.service';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { ImageCreatorUtil } from '../../util/image-creator.util';
import {
  IonItemSliding,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';
import { ResultTextComponent } from '../result-text/result-text.component';

@Component({
  selector: 'app-lemma-display',
  templateUrl: './lemma-display.component.html',
  styleUrls: ['./lemma-display.component.scss'],
  imports: [IonItemSliding, IonItem, IonGrid, IonRow, IonCol, IonIcon, IonItemOptions, IonItemOption, ResultTextComponent],
})
export class LemmaDisplayComponent implements OnInit, OnDestroy {
  private copyService = inject(CopyService);
  private router = inject(Router);
  private configService = inject(ConfigService);
  private favouritesService = inject(FavouritesService);
  private toastService = inject(ToastService);
  private searchService = inject(SearchService);
  private imageCreator = inject(ImageCreatorUtil);

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

  private localeSubscription: Subscription;

  ngOnInit() {
    this.localeSubscription = this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });

    this.completeLemma = this.isSursilvan ? (this.lemma.Corp ? this.lemma.Corp : this.lemma.DStichwort) : '';
  }

  ngOnDestroy(): void {
    this.localeSubscription.unsubscribe();
  }

  goToDetail() {
    if (this.isSaved) {
      this.router.navigate(['/tabs/favourites/detail/' + this.lemma.id], { state: { data: this.lemma } });
    } else {
      this.router.navigate(['/tabs/search/detail/' + this.lemma.id], { queryParams: { searchString: this.searchString } });
    }
  }

  async addFavorite(slider) {
    this.searchService.getDetails(this.lemma.id).then(async (lemma) => {
      await this.favouritesService.addFavorite(this.dictionary, lemma);
      await this.toastService.showNotification('SEARCH.RESULTS.SAVED');
      slider.close();
    });
  }

  async share(slider) {
    if (this.isSursilvan) {
      this.imageCreator.createImageSursilvan(this.lemma.RStichwort + ' ' + this.completeLemma).then(() => {
        this.toastService.showNotification('SHARE.SUCCESS');
        slider.close();
      });
    } else {
      this.imageCreator.createImage(this.lemma.RStichwort, this.lemma.DStichwort).then(() => {
        this.toastService.showNotification('SHARE.SUCCESS');
        slider.close();
      });
    }
  }

  async copy(slider) {
    if (this.isSursilvan) {
      await this.copyService.copyItem(this.lemma.DStichwort, this.lemma.Corp);
    } else {
      await this.copyService.copyItem(this.lemma.DStichwort, this.lemma.RStichwort);
    }
    slider.close();
  }

  async deleteFavourite(slider) {
    this.favouritesService.deleteFavorite(this.lemma.id);
    this.deleteItem.emit(this.lemma);
    await this.toastService.showNotification('SEARCH.RESULTS.DELETED');
    slider.close();
  }

  changeTerm(term: string) {
    this.changeSearchTerm.emit(term);
  }

  get isSursilvan() {
    return this.dictionary === Dictionary.sursilv;
  }

  get hasInflection() {
    // we need to keep the test on preschentsing1/preschentsing3 for backwards compatibility with sursilvan favorites
    return !!this.lemma.inflectiontype || !!this.lemma.preschentsing3 || !!this.lemma.preschentsing1;
  }

  get rmColSize() {
    return this.hasInflection ? 5 : 6;
  }

  get dGramm() {
    let dGramm = '';
    if (this.lemma.DGenus) {
      dGramm += this.lemma.DGenus + ' ';
    }
    if (this.lemma.DGrammatik) {
      dGramm += this.lemma.DGrammatik + ' ';
    }
    return dGramm.trim();
  }

  get rGramm() {
    let rGramm = '';
    if (this.lemma.RGenus) {
      rGramm += this.lemma.RGenus + ' ';
    }
    if (this.lemma.RGrammatik) {
      rGramm += this.lemma.RGrammatik + ' ';
    }
    return rGramm.trim();
  }
}
