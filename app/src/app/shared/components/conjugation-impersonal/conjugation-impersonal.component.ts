import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conjugation-impersonal',
  templateUrl: './conjugation-impersonal.component.html',
  styleUrls: ['./conjugation-impersonal.component.scss'],
})
export class ConjugationImpersonalComponent implements OnInit {
  @Input() public form1;

  @Input() public form2;

  @Input() public form3;

  @Input() public form4;

  @Input() public searchString?: string

  constructor() {}

  ngOnInit() {}

  public replaceComma(input: string) {
    const items = input.split(/[,|\n]/);
    return items.map(e => {
      return e.trim();
    }).join("<br>")
  }
}
