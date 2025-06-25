import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Locale } from 'src/data/search';

@Component({
    selector: 'app-language-selection',
    templateUrl: './language-selection.page.html',
    styleUrls: ['./language-selection.page.scss'],
    standalone: false
})
export class LanguageSelectionPage implements OnInit {
  public localesValues = Locale;      

  constructor(private configService: ConfigService, private router: Router, private translateService: TranslateService) {}

  ngOnInit() {}

  selectLanguage(locale: Locale) {
    this.configService.setSelectedLocale(locale);
    this.translateService.use(locale);
    this.router.navigate(['']);
  }
}
