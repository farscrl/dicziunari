import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnInit {
  appLanguage: 'de' | 'rm';
  searchMode: 'start' | 'substring' | 'end' | 'match';
  includeVerbs: boolean;

  constructor(private configService: ConfigService, private translateService: TranslateService, private navCtrl: NavController) {}

  ngOnInit() {
    this.appLanguage = this.configService.getSelectedLocale() ? this.configService.getSelectedLocale() : undefined;
    this.searchMode = this.configService.getSearchMode() ? this.configService.getSearchMode() : 'start';
    this.includeVerbs = this.configService.isIncludeVerbs() ? this.configService.isIncludeVerbs() : false;
  }

  languageChanged() {
    this.configService.setSelectedLocale(this.appLanguage);
    this.translateService.use(this.appLanguage);
  }

  searchModeChanged() {
    this.configService.setSearchMode(this.searchMode);
    console.log(this.searchMode);
  }

  includeVerbsChanged() {
    this.configService.setIncludeVerbs(this.includeVerbs);
    console.log(this.includeVerbs);
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
