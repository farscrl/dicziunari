import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dictionary } from 'src/data/search';
import { FavouritesService } from '../services/favourites.service';
import { BackupService } from '../services/backup.service';
import { Capacitor } from '@capacitor/core';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonContent,
  IonTitle,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonModal,
  IonRadioGroup,
  IonRadio,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import { LemmaDisplayComponent } from '../shared/components/lemma-display/lemma-display.component';
import { NoFavouritesComponent } from './no-favourites/no-favourites.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-favourites',
  templateUrl: 'favourites.page.html',
  styleUrls: ['favourites.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonPopover,
    IonContent,
    IonTitle,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonModal,
    IonRadioGroup,
    IonRadio,
    LemmaDisplayComponent,
    NoFavouritesComponent,
    TranslatePipe,
  ],
})
export class FavouritesPage implements OnInit, OnDestroy {
  private favouritesService = inject(FavouritesService);
  private backupService = inject(BackupService);

  public dictionaryValues = Dictionary;

  public favouritesRumantschGrischun = [];
  public favouritesSursilvan = [];
  public favouritesSutsilvan = [];
  public favouritesSurmiran = [];
  public favouritesPuter = [];
  public favouritesVallader = [];

  public isEmpty = false;

  private favouritesReadySubscription: Subscription;

  constructor() {
    addIcons({ ellipsisHorizontal, ellipsisVertical });
  }

  ngOnInit(): void {
    this.reloadFavourites();
  }

  ngOnDestroy(): void {
    this.favouritesReadySubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.reloadFavourites();
  }

  deleteLemma(lemma) {
    this.favouritesRumantschGrischun = this.removeLemma(this.favouritesRumantschGrischun, lemma.id);
    this.favouritesSursilvan = this.removeLemma(this.favouritesSursilvan, lemma.id);
    this.favouritesSutsilvan = this.removeLemma(this.favouritesSutsilvan, lemma.id);
    this.favouritesSurmiran = this.removeLemma(this.favouritesSurmiran, lemma.id);
    this.favouritesPuter = this.removeLemma(this.favouritesPuter, lemma.id);
    this.favouritesVallader = this.removeLemma(this.favouritesVallader, lemma.id);
  }

  async importBackup(importMode: string) {
    await this.backupService.importBackup(importMode);
    this.reloadFavourites();
  }

  async exportBackup() {
    await this.backupService.exportBackup();
  }

  get isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android';
  }

  private reloadFavourites() {
    this.favouritesReadySubscription = this.favouritesService.isReadyObservable().subscribe((ready) => {
      if (ready) {
        this.favouritesService.loadFavourites().then((data) => {
          this.reset();
          if (data.length < 1) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
          data.forEach((pled) => {
            switch (pled.dictionary) {
              case 'rumgrischun':
                this.favouritesRumantschGrischun.push(pled);
                break;

              case 'sursilv':
                this.favouritesSursilvan.push(pled);
                break;

              case 'sutsilv':
                this.favouritesSutsilvan.push(pled);
                break;

              case 'surm':
                this.favouritesSurmiran.push(pled);
                break;

              case 'puter':
                this.favouritesPuter.push(pled);
                break;

              case 'vall':
                this.favouritesVallader.push(pled);
                break;
            }
          });
        });
      }
    });
  }

  private removeLemma(favourites: Array<any>, id) {
    return favourites.filter((lemma) => lemma.id !== id);
  }

  private reset() {
    this.favouritesRumantschGrischun = [];
    this.favouritesSursilvan = [];
    this.favouritesSutsilvan = [];
    this.favouritesSurmiran = [];
    this.favouritesPuter = [];
    this.favouritesVallader = [];
  }
}
