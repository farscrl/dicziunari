import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conjugation-personal',
  templateUrl: './conjugation-personal.component.html',
  styleUrls: ['./conjugation-personal.component.scss'],
})
export class ConjugationPersonalComponent implements OnInit {
  @Input() public sing1: string;
  @Input() public sing1Pronoun: string;

  @Input() public sing2: string;
  @Input() public sing2Pronoun: string;

  @Input() public sing3: string;
  @Input() public sing3Pronoun: string;

  @Input() public plural1: string;
  @Input() public plural1Pronoun: string;

  @Input() public plural2: string;
  @Input() public plural2Pronoun: string;

  @Input() public plural3: string;
  @Input() public plural3Pronoun: string;

  constructor() {}

  ngOnInit() {}

  public replaceComma(input: string) {
    const items = input.split(",");
    return items.map(e => {
      return e.trim();
    }).join("\n")
  }
}
