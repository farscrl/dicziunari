import { Component } from '@angular/core';

@Component({
  selector: 'app-favourites',
  templateUrl: 'favourites.page.html',
  styleUrls: ['favourites.page.scss']
})
export class FavouritesPage {

  public favourites = [
    {
      DStichwort: "früh",
      RStichwort: "marvegl",
    },
    {
      DStichwort: "arbeiten",
      RStichwort: "lavurar",
    },
    {
      DStichwort: "Glück",
      RStichwort: "fortuna",
    },
  ]

  constructor() {}

}
