import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Locale } from 'src/data/search';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
    standalone: false
})
export class HelpPage implements OnInit {
  public selectedLocale: Locale = Locale.rm;

  private localeSubscription: Subscription;

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.localeSubscription = this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });
  }

  ngOnDestroy(): void {
    this.localeSubscription.unsubscribe();
  }
}
