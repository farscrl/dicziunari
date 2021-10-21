import { Component, OnInit, Input } from '@angular/core';
import { CopyService } from '../../services/copy.service';
import { SearchDirection, Locale } from 'src/data/search';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';

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

  public selectedLocale: Locale = Locale.rm;

  constructor(private copyService: CopyService, private router: Router, private configService: ConfigService) {}

  ngOnInit() {
    this.configService.getLocaleObservable().subscribe((locale) => {
      this.selectedLocale = locale;
    });
  }

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
