import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourites-detail-page',
  templateUrl: './favourites-detail.page.html',
  styleUrls: ['./favourites-detail.page.scss'],
})
export class FavouritesDetailPage implements OnInit {
  public lemma;

  constructor(private router: Router) {}

  ngOnInit() {
    this.lemma = this.router.getCurrentNavigation().extras.state.data;
    console.log(this.lemma);
  }
}
