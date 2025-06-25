import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'translateCut',
    standalone: false
})
export class TranslateCutPipe implements PipeTransform {

  transform(value: string, index: number): string {
    const cutIndex = Number(index);
    return value.split('|')[cutIndex];
  }
}
