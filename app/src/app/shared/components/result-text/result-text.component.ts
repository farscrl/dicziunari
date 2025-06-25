import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-result-text',
    templateUrl: './result-text.component.html',
    styleUrls: ['./result-text.component.scss'],
    standalone: false
})
export class ResultTextComponent implements OnInit {
  @Input()
  public text: string;

  @Input()
  public flex: string;

  @Input()
  public grammar: string;

  @Input()
  public semantics: string;

  @Input()
  public searchString: string;

  @Output()
  public changeSearchTerm = new EventEmitter<string>();

  public displayText: string;
  public isRedirect = false;

  constructor() {}

  ngOnInit() {
    if (this.text.startsWith('cf. ')) {
      this.isRedirect = true;
      this.displayText = this.text.replace('cf. ', '');
    } else {
      this.displayText = this.text;
    }
  }
}
