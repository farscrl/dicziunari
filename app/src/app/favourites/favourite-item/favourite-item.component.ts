import { Component, OnInit, Input } from '@angular/core';
import { CopyService } from '../../services/copy.service';

@Component({
  selector: 'app-favourite-item',
  templateUrl: './favourite-item.component.html',
  styleUrls: ['./favourite-item.component.scss'],
})
export class FavouriteItemComponent implements OnInit {
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
  private searchDirection: 'fromDe' | 'fromRm' | 'both' = 'both';

  constructor(private copyService: CopyService) {}

  ngOnInit() {}

  addFavorite() {
    console.log('implement me. add favorite: ' + this.lemmaD);
  }

  copy() {
    this.copyService.copyItem(this.lemmaD, this.lemmaR);
  }
}
