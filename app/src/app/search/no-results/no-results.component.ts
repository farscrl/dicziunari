import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { ConfigService } from '../../services/config.service';
import { SearchMode } from 'src/data/search';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent implements OnInit {
  @ViewChild('searchModeSelect', { static: false }) searchModeSelectRef: IonSelect;

  searchMode: SearchMode;

  interfaceOptions = {
    cssClass: 'search-mode',
  };

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.searchMode = this.configService.getSearchMode();
  }

  changeSearchMode() {
    if (this.searchModeSelectRef) {
      this.searchModeSelectRef.open();
    }
  }

  valueChanged(event) {
    this.configService.setSearchMode(event.detail.value);
    this.searchMode = event.detail.value;
  }
}
