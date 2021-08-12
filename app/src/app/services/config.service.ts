import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private locale: 'de' | 'rm' | undefined;

  private searchMode: 'start' | 'substring' | 'end' | 'match' = 'start';

  private includeVerbs = false;

  constructor(private localStorageService: LocalStorageService) {
    this.locale = localStorageService.getItem('locale') as 'de' | 'rm' | undefined;
    this.searchMode = localStorageService.getItem('searchMode') as 'start' | 'substring' | 'end' | 'match';
    this.includeVerbs = JSON.parse(localStorageService.getItem('includeVerbs')) as boolean;
  }

  public getSelectedLocale(): 'de' | 'rm' | undefined {
    return this.locale;
  }

  public setSelectedLocale(locale: 'de' | 'rm') {
    this.locale = locale;
    this.localStorageService.setItem('locale', locale);
  }

  public isLocaleSelected(): boolean {
    return !!this.locale;
  }

  public getSearchMode(): 'start' | 'substring' | 'end' | 'match' {
    return this.searchMode;
  }

  public setSearchMode(mode: 'start' | 'substring' | 'end' | 'match') {
    this.searchMode = mode;
    this.localStorageService.setItem('searchMode', mode);
  }

  public isIncludeVerbs(): boolean {
    return this.includeVerbs;
  }

  public setIncludeVerbs(includeVerbs: boolean) {
    this.includeVerbs = includeVerbs;
    this.localStorageService.setItem('includeVerbs', JSON.stringify(includeVerbs));
  }
}
