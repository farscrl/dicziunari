import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect } from '@ionic/angular';
import { ConfigService } from '../../services/config.service';
import { SearchDirection, SearchMode } from 'src/data/search';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent implements OnInit {
  @ViewChild('searchModeSelect', { static: false }) searchModeSelectRef: IonSelect;

  searchMode: SearchMode;
  public searchDirection: SearchDirection;

  interfaceOptions = {
    cssClass: 'search-mode',
  };

  private searchDirectionSubscription: Subscription;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.searchMode = this.configService.getSearchMode();
    this.searchDirectionSubscription = this.configService.getSearchDirectionObservable().subscribe((searchDirection) => {
      this.searchDirection = searchDirection;
    });
  }

  ngOnDestroy(): void {
    this.searchDirectionSubscription.unsubscribe();
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
