import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss'],
  imports: [IonContent],
})
export class PlaceholderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
