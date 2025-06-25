import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Locale } from 'src/data/search';

@Component({
    selector: 'app-info',
    templateUrl: './info.page.html',
    styleUrls: ['./info.page.scss'],
    standalone: false
})
export class InfoPage implements OnInit {
  public appVersion = '-';

  public selectedLocale: Locale = Locale.rm;

  private localeSubscription: Subscription;

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    if (Capacitor.isNativePlatform()) {
      App.getInfo().then((info) => {
        this.appVersion = info.version;
      });
    }

    this.localeSubscription = this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });
  }

  ngOnDestroy(): void {
    this.localeSubscription.unsubscribe();
  }
}
