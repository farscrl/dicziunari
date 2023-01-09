import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Dictionary} from "../../../data/search";

@Component({
  selector: 'app-favourites-detail-page',
  templateUrl: './favourites-detail.page.html',
  styleUrls: ['./favourites-detail.page.scss'],
})
export class FavouritesDetailPage implements OnInit {
  public lemma;

  public dictionary?: Dictionary;

  constructor(private router: Router) {}

  ngOnInit() {
    this.lemma = this.router.getCurrentNavigation().extras.state.data;
    this.dictionary = this.lemma.dictionary;
  }
}
