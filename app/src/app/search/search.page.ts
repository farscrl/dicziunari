import { Component } from '@angular/core';
import { SearchService } from '../services/search.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage {
  public lemma = '';
  public selectedDictionary;

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

  constructor(private searchService: SearchService, private configService: ConfigService) {
    this.selectedDictionary = configService.getSelectedDictionary();
  }

  search() {
    this.searchService.searchTerm(this.lemma).then((pleds) => {
      this.pleds = pleds;
    });
  }

  dictionaryChanged(value) {
    this.configService.setSelectedDictionary(value.detail.value);
  }
}
