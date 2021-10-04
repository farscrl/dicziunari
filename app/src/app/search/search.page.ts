import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  public lemma = 'arbeiten';
  public selectedDictionary;
  public searchDirection;

  public pleds = [
    {
      DStichwort: 'arbeiten',
      RStichwort: 'lavurar',
    },
    {
      DStichwort: 'arbeiten (krampfen)',
      RStichwort: 'travagliar',
    },
    {
      DStichwort: 'arbeiten (hantieren)',
      RStichwort: 'truschar',
    },
    {
      DStichwort: 'arbeiten',
      RStichwort: 'traffitgar',
    },
    {
      DStichwort: 'arbeiten (als Taglöhner)',
      RStichwort: 'ir a schurnada',
    },
    {
      DStichwort: 'arbeiten',
      RStichwort: 'ir a dis',
    },
    {
      DStichwort: 'Teilzeit arbeiten  ',
      RStichwort: 'lavurar a temp parzial',
    },
  ];

  constructor(private searchService: SearchService, private configService: ConfigService) {}

  ngOnInit() {
    this.selectedDictionary = this.configService.getSelectedDictionary();
    this.searchDirection = this.configService.getSearchDirection();
  }

  search() {
    this.searchService.searchTerm(this.lemma).then((pleds) => {
      this.pleds = pleds;
    });
  }

  dictionaryChanged(value) {
    this.configService.setSelectedDictionary(value.detail.value);
  }

  changeSearchDirection() {
    switch (this.searchDirection) {
      case 'fromDe':
        this.configService.setSearchDirection('fromRm');
        this.searchDirection = this.configService.getSearchDirection();
        break;
      case 'fromRm':
        this.configService.setSearchDirection('both');
        this.searchDirection = this.configService.getSearchDirection();
        break;
      case 'both':
      default:
        this.configService.setSearchDirection('fromDe');
        this.searchDirection = this.configService.getSearchDirection();
        break;
    }
  }
}
