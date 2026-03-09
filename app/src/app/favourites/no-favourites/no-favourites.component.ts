import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-no-favourites',
  templateUrl: './no-favourites.component.html',
  styleUrls: ['./no-favourites.component.scss'],
  imports: [IonContent, TranslatePipe],
})
export class NoFavouritesComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
