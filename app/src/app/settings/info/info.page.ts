import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  public appVersion = '-';

  constructor() {}

  ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      App.getInfo().then((info) => {
        this.appVersion = info.version;
      });
    }
  }
}
