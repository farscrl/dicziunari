import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { Dictionary } from '../../../data/search';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent } from '@ionic/angular/standalone';
import { ConjugationComponent } from '../../components/conjugation/conjugation.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-detail-page',
  templateUrl: './search-detail.page.html',
  styleUrls: ['./search-detail.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, ConjugationComponent, TranslatePipe],
})
export class SearchDetailPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);
  configService = inject(ConfigService);

  public id: string;

  public lemma;

  public dictionary: Dictionary;

  private routeParamsSubscription: Subscription;
  private dictionarySubscription: Subscription;

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.searchService.getDetails(this.id).then((lemma) => {
        this.lemma = lemma;
      });
    });
    this.dictionarySubscription = this.configService.getDictionaryObservable().subscribe((dict) => {
      this.dictionary = dict;
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.dictionarySubscription.unsubscribe();
  }
}
