import { Component, OnInit, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Locale } from 'src/data/search';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, TranslatePipe],
})
export class InfoPage implements OnInit {
  private configService = inject(ConfigService);

  public appVersion = '-';

  public selectedLocale: Locale = Locale.rm;

  private localeSubscription: Subscription;

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
