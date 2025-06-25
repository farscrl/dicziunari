import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config.service';
import { SearchMode } from 'src/data/search';
import { Config } from "@ionic/angular";

@Component({
    selector: 'app-search-mode-modal',
    templateUrl: './search-mode-modal.component.html',
    styleUrls: ['./search-mode-modal.component.scss'],
    standalone: false
})
export class SearchModeModalComponent implements OnInit {
  public selectedSearchMode: SearchMode;

  constructor(
    private configService: ConfigService,
    private modalController: ModalController,
    private config: Config
  ) { }

  ngOnInit() {
    this.selectedSearchMode = this.configService.getSearchMode();
  }

  onChange(searchMode) {
    this.configService.setSearchMode(searchMode);
    this.modalController.dismiss();
  }

  get slot() {
    if (this.config.get("mode") === 'ios') {
      return 'end';
    }
    return 'start';
  }
}
