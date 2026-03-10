import { Component, OnInit, inject } from '@angular/core';
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
import { Dictionary } from 'src/data/search';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dictionary-modal',
  templateUrl: './dictionary-modal.component.html',
  styleUrls: ['./dictionary-modal.component.scss'],
  imports: [IonContent, IonItem, IonTitle, IonList, IonRadioGroup, IonLabel, IonRadio, FormsModule, TranslatePipe],
})
export class DictionaryModalComponent implements OnInit {
  private configService = inject(ConfigService);
  private modalController = inject(ModalController);
  private config = inject(Config);

  public selectedDictionary: Dictionary;

  ngOnInit() {
    this.selectedDictionary = this.configService.getSelectedDictionary();
  }

  onChange(dictionary) {
    this.configService.setSelectedDictionary(dictionary);
    this.modalController.dismiss();
  }

  get slot() {
    if (this.config.get('mode') === 'ios') {
      return 'end';
    }
    return 'start';
  }
}
