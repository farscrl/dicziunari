import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class IosHeaderCleanerUtil {
  public removeIosOnlyHeaderLine(words: any[]): any[] {
    if (!words || words.length === 0) {
      return words;
    }
    if (!!words[0] && 'ios_columns' in words[0]) {
      words.shift();
    }
    return JSON.parse(JSON.stringify(words));
  }
}
