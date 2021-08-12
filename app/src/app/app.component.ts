import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translateService: TranslateService, private platform: Platform, private configService: ConfigService) {
    this.platform.ready().then(() => {
      SplashScreen.show();
      setTimeout(() => {
        SplashScreen.hide();
      }, 5000);
    });
    this.initTranslateService();
  }

  private initTranslateService() {
    this.translateService.addLangs(['de', 'rm']);
    if (!!this.configService.getSelectedLocale()) {
      this.translateService.setDefaultLang(this.configService.getSelectedLocale());
      this.translateService.use(this.configService.getSelectedLocale());
    } else {
      this.translateService.setDefaultLang('de');
      this.translateService.use('de');
    }
  }
}
