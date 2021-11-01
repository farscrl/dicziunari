import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-conjugation',
  templateUrl: './conjugation.component.html',
  styleUrls: ['./conjugation.component.scss'],
})
export class ConjugationComponent {
  @Input()
  public lemma;

  constructor() {}
}
