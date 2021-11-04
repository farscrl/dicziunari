import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { ConfigService } from './services/config.service';
import { SQLiteService } from './services/sqlite.service';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private sqlitePluginInitialized = false;

  constructor(
    private translateService: TranslateService,
    private platform: Platform,
    private configService: ConfigService,
    private sqliteService: SQLiteService,
  ) {
    this.platform.ready().then(() => {
      SplashScreen.show();
      if (Capacitor.isNativePlatform()) {
        Keyboard.setAccessoryBarVisible({ isVisible: false });
      }
      setTimeout(() => {
        SplashScreen.hide();
      }, 5000);
    });
    this.initTranslateService();
    this.sqliteService.initializePlugin().then((ret) => {
      this.sqlitePluginInitialized = ret;
    });
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
