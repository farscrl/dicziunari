import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-detail-page',
  templateUrl: './search-detail.page.html',
  styleUrls: ['./search-detail.page.scss'],
})
export class SearchDetailPage implements OnInit, OnDestroy {
  public id: string;

  public lemma;

  private routeParamsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.searchService.getDetails(this.id).then((lemma) => {
        this.lemma = lemma;
      });
    });
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
  }
}
