import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config.service';
import { Dictionary } from 'src/data/search';
import { Config } from "@ionic/angular";

@Component({
  selector: 'app-search-mode-modal',
  templateUrl: './search-mode-modal.component.html',
  styleUrls: ['./search-mode-modal.component.scss'],
})
export class SearchModeModalComponent implements OnInit {

  public selectedDictionary: Dictionary;

  constructor(
    private configService: ConfigService,
    private modalController: ModalController,
    private config: Config
  ) { }

  ngOnInit() {
    this.selectedDictionary = this.configService.getSelectedDictionary();
  }

  onChange(event) {
    const value = event.detail.value;
    this.configService.setSelectedDictionary(value);
    this.modalController.dismiss();
  }

  get slot() {
    if (this.config.get("mode") === 'ios') {
      return 'end';
    }
    return 'start';
  }
}
