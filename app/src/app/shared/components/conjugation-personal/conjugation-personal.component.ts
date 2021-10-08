import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conjugation-personal',
  templateUrl: './conjugation-personal.component.html',
  styleUrls: ['./conjugation-personal.component.scss'],
})
export class ConjugationPersonalComponent implements OnInit {
  @Input()
  public sing1: string;

  @Input()
  public sing2: string;

  @Input()
  public sing3: string;

  @Input()
  public plural1: string;

  @Input()
  public plural2: string;

  @Input()
  public plural3: string;

  constructor() {}

  ngOnInit() {}
}
