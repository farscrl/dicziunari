import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { Locale, SearchMode } from 'src/data/search';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  appLanguage: Locale | undefined;
  searchMode: SearchMode;
  includeVerbs: boolean;

  private searchModeSubscription: Subscription;

  constructor(private configService: ConfigService, private translateService: TranslateService, private navCtrl: NavController) {}

  ngOnInit() {
    this.appLanguage = this.configService.getSelectedLocale();
    this.searchModeSubscription = this.configService.getSearchModeObservable().subscribe((value) => {
      this.searchMode = value;
    });
    this.includeVerbs = this.configService.isIncludeVerbs();
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
}
