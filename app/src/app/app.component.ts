import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private translateService: TranslateService,
  ) {
    this.initTranslateService();
  }

  private initTranslateService() {
    this.translateService.addLangs(['de', 'rm']);
    this.translateService.setDefaultLang('de');

    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/de|rm/) ? browserLang : 'de');
  }
}
