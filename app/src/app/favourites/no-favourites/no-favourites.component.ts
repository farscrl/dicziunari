import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-no-favourites',
  templateUrl: './no-favourites.component.html',
  styleUrls: ['./no-favourites.component.scss'],
  imports: [IonicModule, TranslatePipe],
})
export class NoFavouritesComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
