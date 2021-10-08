import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-conjugation',
  templateUrl: './conjugation.component.html',
  styleUrls: ['./conjugation.component.scss'],
})
export class ConjugationComponent implements OnInit {
  @Input()
  public id: string;

  public lemma;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.getDetails(this.id).then((lemma) => {
      this.lemma = lemma;
      console.log(lemma);
    });
  }
}
