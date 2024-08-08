import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dictionary } from 'src/data/search';
import { FavouritesService } from '../services/favourites.service';
import { BackupService } from '../services/backup.service';

@Component({
    selector: 'app-favourites',
    templateUrl: 'favourites.page.html',
    styleUrls: ['favourites.page.scss'],
    standalone: false
})
export class FavouritesPage implements OnInit, OnDestroy {
  public dictionaryValues = Dictionary;

  public favouritesRumantschGrischun = [];
  public favouritesSursilvan = [];
  public favouritesSutsilvan = [];
  public favouritesSurmiran = [];
  public favouritesPuter = [];
  public favouritesVallader = [];

  public isEmpty = false;

  private favouritesReadySubscription: Subscription;

  constructor(
    private favouritesService: FavouritesService,
    private backupService: BackupService,
  ) {}

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
