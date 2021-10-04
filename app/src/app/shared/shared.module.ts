import { NgModule } from '@angular/core';
import { HighlightPipe } from '../pipes/highlight.pipe';

@NgModule({
  declarations: [HighlightPipe],
  exports: [HighlightPipe],
})
export class SharedModule {}
