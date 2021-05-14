import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private translateService: TranslateService,
    private platform: Platform,
    private searchService: SearchService,
  ) {

    this.platform.ready().then(() => {
      SplashScreen.show();
      setTimeout(function () {
        SplashScreen.hide();
      }, 5000);
    });
    this.initTranslateService();
  }

  private initTranslateService() {
    this.translateService.addLangs(['de', 'rm']);
    this.translateService.setDefaultLang('de');

    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/de|rm/) ? browserLang : 'de');
  }
}
