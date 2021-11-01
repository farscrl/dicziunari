import { Component, OnInit } from '@angular/core';
import { FavouritesService } from '../services/favourites.service';

@Component({
  selector: 'app-favourites',
  templateUrl: 'favourites.page.html',
  styleUrls: ['favourites.page.scss'],
})
export class FavouritesPage implements OnInit {
  public favouritesRumantschGrischun = [];
  public favouritesSursilvan = [];
  public favouritesSutsilvan = [];
  public favouritesSurmiran = [];
  public favouritesPuter = [];
  public favouritesVallader = [];

  constructor(private favouritesService: FavouritesService) {}

  ngOnInit(): void {
    this.reloadFavourites();
  }

  ionViewWillEnter() {
    this.reloadFavourites();
  }

  deleteLemma(lemma) {
    console.log(lemma);
    this.favouritesRumantschGrischun = this.removeLemma(this.favouritesRumantschGrischun, lemma.id);
    this.favouritesSursilvan = this.removeLemma(this.favouritesSursilvan, lemma.id);
    this.favouritesSutsilvan = this.removeLemma(this.favouritesSutsilvan, lemma.id);
    this.favouritesSurmiran = this.removeLemma(this.favouritesSurmiran, lemma.id);
    this.favouritesPuter = this.removeLemma(this.favouritesPuter, lemma.id);
    this.favouritesVallader = this.removeLemma(this.favouritesVallader, lemma.id);
  }

  private reloadFavourites() {
    this.favouritesService.isReadyObservable().subscribe((ready) => {
      if (ready) {
        this.favouritesService.loadFavourites().then((data) => {
          this.reset();
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
