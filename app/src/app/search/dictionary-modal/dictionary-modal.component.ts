import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config.service';
import { Dictionary } from 'src/data/search';
import { Config } from "@ionic/angular";

@Component({
  selector: 'app-dictionary-modal',
  templateUrl: './dictionary-modal.component.html',
  styleUrls: ['./dictionary-modal.component.scss'],
})
export class DictionaryModalComponent implements OnInit {

  public selectedDictionary: Dictionary;

  constructor(
    private configService: ConfigService,
    private modalController: ModalController,
    private config: Config
  ) { }

  ngOnInit() {
    this.selectedDictionary = this.configService.getSelectedDictionary();
  }

  onChange(dictionary) {
    this.configService.setSelectedDictionary(dictionary);
    this.modalController.dismiss();
  }

  get slot() {
    if (this.config.get("mode") === 'ios') {
      return 'end';
    }
    return 'start';
  }
}
