import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-detail-page',
  templateUrl: './search-detail.page.html',
  styleUrls: ['./search-detail.page.scss'],
})
export class SearchDetailPage implements OnInit {
  public id: string;

  public lemma;

  constructor(private route: ActivatedRoute, private searchService: SearchService) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.searchService.getDetails(this.id).then((lemma) => {
        this.lemma = lemma;
        console.log(lemma);
      });
    });
  }
}
