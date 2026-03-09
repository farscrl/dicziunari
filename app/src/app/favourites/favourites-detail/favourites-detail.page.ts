import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dictionary } from '../../../data/search';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent } from '@ionic/angular/standalone';
import { ConjugationComponent } from '../../shared/components/conjugation/conjugation.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-favourites-detail-page',
  templateUrl: './favourites-detail.page.html',
  styleUrls: ['./favourites-detail.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, ConjugationComponent, TranslatePipe],
})
export class FavouritesDetailPage implements OnInit {
  public lemma;

  public dictionary?: Dictionary;

  constructor(private router: Router) {}

  ngOnInit() {
    this.lemma = this.router.currentNavigation().extras.state.data;
    this.dictionary = this.lemma.dictionary;
  }
}
