import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';
import { ConfigService } from "../../services/config.service";
import { Dictionary } from "../../../data/search";

@Component({
  selector: 'app-search-detail-page',
  templateUrl: './search-detail.page.html',
  styleUrls: ['./search-detail.page.scss'],
})
export class SearchDetailPage implements OnInit, OnDestroy {
  public id: string;

  public lemma;

  public dictionary: Dictionary;

  private routeParamsSubscription: Subscription;
  private dictionarySubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    public configService: ConfigService
  ) {}

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.searchService.getDetails(this.id).then((lemma) => {
        this.lemma = lemma;
      });
    });
    this.dictionarySubscription = this.configService.getDictionaryObservable().subscribe(dict => {
      this.dictionary = dict;
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.dictionarySubscription.unsubscribe();
  }
}
