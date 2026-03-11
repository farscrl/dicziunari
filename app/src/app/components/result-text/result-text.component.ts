import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { HighlightPipe } from '../../pipes/highlight.pipe';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';

@Component({
  selector: 'app-result-text',
  templateUrl: './result-text.component.html',
  styleUrls: ['./result-text.component.scss'],
  imports: [IonIcon, HighlightPipe, AudioPlayerComponent],
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

  @Input()
  public pronunciation: string;

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
