import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    const re = new RegExp(args, 'gi');
    return value.replace(re, '<mark>$&</mark>');
  }
}
