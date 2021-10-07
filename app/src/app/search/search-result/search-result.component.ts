import { Component, OnInit, Input } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input()
  public lemmaId: string;

  @Input()
  public lemmaD: string;

  @Input()
  public lemmaR: string;

  @Input()
  public isVerb: boolean;

  @Input()
  public searchString: string;

  @Input()
  private searchDirection: string;

  constructor(private toastController: ToastController, private translateService: TranslateService) {}

  ngOnInit() {}

  addFavorite() {
    console.log('implement me. add favorite: ' + this.lemmaD);
  }

  async copy() {
    await Clipboard.write({
      // eslint-disable-next-line id-blacklist
      string: this.lemmaR + ' / ' + this.lemmaD,
    });

    const toast = await this.toastController.create({
      color: 'dark',
      duration: 2000,
      message: this.translateService.instant('SEARCH.RESULTS.COPIED'),
    });

    await toast.present();
  }
}
