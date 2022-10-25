import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { ConfigService } from './services/config.service';
import { SQLiteService } from './services/sqlite.service';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';
import { ColorModeService } from "./services/color-mode.service";

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
    private colorMode: ColorModeService,
  ) {
    this.platform.ready().then(() => {
      SplashScreen.show();
      if (Capacitor.isNativePlatform()) {
        Keyboard.setAccessoryBarVisible({ isVisible: false });
      }
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    });
    this.initTranslateService();
    this.sqliteService.initializePlugin().then((ret) => {
      this.sqlitePluginInitialized = ret;
    });
    this.initColorMode();
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

  private initColorMode() {
    this.colorMode.isDarkModeSubject.subscribe((darkMode) => {
      if (darkMode) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    })
  }
}
