import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Locale } from 'src/data/search';
import { Device } from '@capacitor/device';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.page.html',
    styleUrls: ['./feedback.page.scss'],
    standalone: false
})
export class FeedbackPage implements OnInit {

  public selectedLocale: Locale = Locale.rm;

  public body: string = "";

  private localeSubscription: Subscription;

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.localeSubscription = this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });
    this.loadDeviceInfo();
  }

  ngOnDestroy(): void {
    this.localeSubscription.unsubscribe();
  }

  private async loadDeviceInfo(): Promise<void> {
    const info = await Device.getInfo();

    this.body = "\n\n\n\n\n\n" +
      "os: " + info.operatingSystem + "\n" +
      "osVersion: " + info.osVersion + "\n" +
      "model: " + info.model + "\n" +
      "";

    this.body = encodeURIComponent(this.body);
  }
}
