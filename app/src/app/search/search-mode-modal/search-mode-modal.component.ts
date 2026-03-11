import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonItem,
  IonTitle,
  IonList,
  IonRadioGroup,
  IonLabel,
  IonRadio,
  ModalController,
  Config,
} from '@ionic/angular/standalone';
import { ConfigService } from 'src/app/services/config.service';
import { SearchMode } from 'src/data/search';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-mode-modal',
  templateUrl: './search-mode-modal.component.html',
  styleUrls: ['./search-mode-modal.component.scss'],
  imports: [IonContent, IonItem, IonTitle, IonList, IonRadioGroup, IonLabel, IonRadio, FormsModule, TranslatePipe],
})
export class SearchModeModalComponent {
  private configService = inject(ConfigService);
  private modalController = inject(ModalController);
  private config = inject(Config);

  public selectedSearchMode: SearchMode;

  ionViewWillEnter() {
    this.selectedSearchMode = this.configService.getSearchMode();
  }

  onChange(searchMode: SearchMode) {
    this.configService.setSearchMode(searchMode);
    this.modalController.dismiss();
  }

  get slot() {
    if (this.config.get('mode') === 'ios') {
      return 'end';
    }
    return 'start';
  }

  protected readonly SearchMode = SearchMode;
}
