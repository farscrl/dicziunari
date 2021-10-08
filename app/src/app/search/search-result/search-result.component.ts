import { Component, OnInit, Input } from '@angular/core';
import { CopyService } from '../../services/copy.service';

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

  constructor(private copyService: CopyService) {}

  ngOnInit() {}

  addFavorite() {
    console.log('implement me. add favorite: ' + this.lemmaD);
  }

  async copy() {
    this.copyService.copyItem(this.lemmaD, this.lemmaR);
  }
}
