import { NgModule } from '@angular/core';
import { HighlightPipe } from '../pipes/highlight.pipe';
import { ConjugationComponent } from './components/conjugation/conjugation.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConjugationPersonalComponent } from './components/conjugation-personal/conjugation-personal.component';
import { ConjugationImpersonalComponent } from './components/conjugation-impersonal/conjugation-impersonal.component';

@NgModule({
  imports: [IonicModule, CommonModule, TranslateModule],
  declarations: [HighlightPipe, ConjugationComponent, ConjugationPersonalComponent, ConjugationImpersonalComponent],
  exports: [HighlightPipe, ConjugationComponent, TranslateModule],
})
export class SharedModule {}
