import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Locale } from 'src/data/search';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

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
