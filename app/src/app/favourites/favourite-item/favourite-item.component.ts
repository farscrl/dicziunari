import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { Locale, SearchDirection } from 'src/data/search';
import { CopyService } from '../../services/copy.service';
import { FavouritesService } from '../../services/favourites.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-favourite-item',
  templateUrl: './favourite-item.component.html',
  styleUrls: ['./favourite-item.component.scss'],
})
export class FavouriteItemComponent implements OnInit {
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
  public deleteItem = new EventEmitter<any>();

  public selectedLocale: Locale = Locale.rm;

  constructor(
    private copyService: CopyService,
    private configService: ConfigService,
    private favouritesService: FavouritesService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });
  }

  async deleteFavourite() {
    this.favouritesService.deleteFavorite(this.lemma.id);
    this.deleteItem.emit(this.lemma);
    await this.toastService.showNotification('SEARCH.RESULTS.DELETED');
  }

  copy() {
    this.copyService.copyItem(this.lemmaD, this.lemmaR);
  }
}
