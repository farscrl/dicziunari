import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  changeSearchMode() {
    console.log('change search mode');
  }
}
