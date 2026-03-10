import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonIcon, IonButton, ModalController } from '@ionic/angular/standalone';
import { ConfigService } from '../../services/config.service';
import { SearchDirection, SearchMode } from 'src/data/search';
import { Subscription } from 'rxjs';
import { SearchModeModalComponent } from '../search-mode-modal/search-mode-modal.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
  imports: [IonContent, IonIcon, IonButton, TranslatePipe],
})
export class NoResultsComponent implements OnInit {
  private configService = inject(ConfigService);
  private modalController = inject(ModalController);

  searchMode: SearchMode;
  public searchDirection: SearchDirection;

  interfaceOptions = {
    cssClass: 'search-mode',
  };

  private searchDirectionSubscription: Subscription;

  ngOnInit() {
    this.searchMode = this.configService.getSearchMode();
    this.searchDirectionSubscription = this.configService.getSearchDirectionObservable().subscribe((searchDirection) => {
      this.searchDirection = searchDirection;
    });
  }

  ngOnDestroy(): void {
    this.searchDirectionSubscription.unsubscribe();
  }

  async changeSearchMode() {
    const modal = await this.modalController.create({
      component: SearchModeModalComponent,
      cssClass: 'search-mode',
    });
    return await modal.present();
  }

  valueChanged(event) {
    this.configService.setSearchMode(event.detail.value);
    this.searchMode = event.detail.value;
  }
}
