import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnInit {
  appLanguage;

  constructor(private configService: ConfigService, private translateService: TranslateService, private router: Router) {}

  ngOnInit() {
    this.appLanguage = this.configService.getSelectedLocale();
  }

  languageChanged() {
    this.configService.setSelectedLocale(this.appLanguage);
    this.translateService.use(this.appLanguage);
  }
}
