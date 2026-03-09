import { Component, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config.service';
import { Dictionary } from 'src/data/search';
import { Config } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dictionary-modal',
  templateUrl: './dictionary-modal.component.html',
  styleUrls: ['./dictionary-modal.component.scss'],
  imports: [IonicModule, FormsModule, TranslatePipe],
})
export class DictionaryModalComponent implements OnInit {
  public selectedDictionary: Dictionary;

  constructor(
    private configService: ConfigService,
    private modalController: ModalController,
    private config: Config,
  ) {}

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
