import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Input()
  public lemmaId: string;

  @Input()
  public lemmaD: string;

  @Input()
  public lemmaR: string;

  @Input()
  public isVerb: boolean;

  @Input()
  public searchString: string;

  @Input()
  private searchDirection: string;

  constructor() {}

  ngOnInit() {}

  addFavorite() {
    console.log('implement me. add favorite: ' + this.lemmaD);
  }

  copy() {
    console.log('implement me. copy: ' + this.lemmaD);
  }
}
