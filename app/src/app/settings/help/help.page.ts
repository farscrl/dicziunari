import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { Locale } from 'src/data/search';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonIcon, TranslatePipe],
})
export class HelpPage implements OnInit {
  private configService = inject(ConfigService);

  public selectedLocale: Locale = Locale.rm;

  private localeSubscription: Subscription;

  ngOnInit() {
    this.localeSubscription = this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });
  }

  ngOnDestroy(): void {
    this.localeSubscription.unsubscribe();
  }
}
