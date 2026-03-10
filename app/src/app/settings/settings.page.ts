import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonRadioGroup,
  IonListHeader,
  IonLabel,
  IonItem,
  IonRadio,
  NavController,
} from '@ionic/angular/standalone';
import { Locale, SearchMode } from 'src/data/search';
import { Subscription } from 'rxjs';
import { ColorMode, ColorModeService } from '../services/color-mode.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonRadioGroup,
    IonListHeader,
    IonLabel,
    IonItem,
    IonRadio,
    FormsModule,
    TranslatePipe,
  ],
})
export class SettingsPage implements OnInit, OnDestroy {
  private configService = inject(ConfigService);
  private translateService = inject(TranslateService);
  private navCtrl = inject(NavController);
  private colorMode = inject(ColorModeService);

  appLanguage: Locale | undefined;
  searchMode: SearchMode;
  includeVerbs: boolean;

  private searchModeSubscription: Subscription;

  public colorModes: ColorMode[] = ['auto', 'dark', 'light'];
  public currentColorMode: ColorMode;

  ngOnInit() {
    this.appLanguage = this.configService.getSelectedLocale();
    this.searchModeSubscription = this.configService.getSearchModeObservable().subscribe((value) => {
      this.searchMode = value;
    });
    this.includeVerbs = this.configService.isIncludeVerbs();
    this.currentColorMode = this.colorMode.getMode();
  }

  ngOnDestroy(): void {
    this.searchModeSubscription.unsubscribe();
  }

  languageChanged() {
    this.configService.setSelectedLocale(this.appLanguage);
    this.translateService.use(this.appLanguage);
  }

  searchModeChanged() {
    this.configService.setSearchMode(this.searchMode);
  }

  includeVerbsChanged() {
    this.configService.setIncludeVerbs(this.includeVerbs);
  }

  openPage(page: string) {
    switch (page) {
      case 'feedback':
        this.navCtrl.navigateForward('tabs/settings/feedback');
        break;

      case 'help':
        this.navCtrl.navigateForward('tabs/settings/help');
        break;

      case 'info':
        this.navCtrl.navigateForward('tabs/settings/info');
        break;
    }
  }

  async changeColorScheme(event: any) {
    const colorMode = event.detail.value;
    this.colorMode.setMode(colorMode);
  }
}
