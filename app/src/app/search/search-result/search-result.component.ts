import { Component, OnInit, Input } from '@angular/core';
import { CopyService } from '../../services/copy.service';
import { SearchDirection } from 'src/data/search';
import { Router } from '@angular/router';

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
  public completeLemma: string;

  @Input()
  public isVerb: boolean;

  @Input()
  public searchString: string;

  @Input()
  public searchDirection: SearchDirection = SearchDirection.both;

  @Input()
  public isSursilvan: boolean;

  constructor(private copyService: CopyService, private router: Router) {}

  ngOnInit() {}

  goToDetail() {
    this.router.navigate(['/tabs/search/detail/' + this.lemmaId]);
  }

  addFavorite() {
    console.log('implement me. add favorite: ' + this.lemmaD);
  }

  async copy() {
    this.copyService.copyItem(this.lemmaD, this.lemmaR);
  }
}
