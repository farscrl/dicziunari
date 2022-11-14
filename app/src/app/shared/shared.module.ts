import { NgModule } from '@angular/core';
import { HighlightPipe } from '../pipes/highlight.pipe';
import { TranslateCutPipe } from "../pipes/translate-cut.pipe";
import { ConjugationComponent } from './components/conjugation/conjugation.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConjugationPersonalComponent } from './components/conjugation-personal/conjugation-personal.component';
import { ConjugationImpersonalComponent } from './components/conjugation-impersonal/conjugation-impersonal.component';
import { ResultTextComponent } from './components/result-text/result-text.component';
import { LemmaDisplayComponent } from './components/lemma-display/lemma-display.component';

@NgModule({
  imports: [IonicModule, CommonModule, TranslateModule],

  declarations: [
    HighlightPipe,
    TranslateCutPipe,
    ConjugationComponent,
    ConjugationPersonalComponent,
    ConjugationImpersonalComponent,
    ResultTextComponent,
    LemmaDisplayComponent,
  ],
  exports: [HighlightPipe, ConjugationComponent, ResultTextComponent, TranslateModule, LemmaDisplayComponent],
})
export class SharedModule {}
