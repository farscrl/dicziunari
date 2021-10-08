import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dictionary, Locale, SearchDirection, SearchMode } from 'src/data/search';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private localeSubject = new BehaviorSubject<Locale>(undefined);

  private dictionarySubject = new BehaviorSubject<Dictionary>(Dictionary.rumgrischun);

  private searchDirectionSubject = new BehaviorSubject<SearchDirection>(SearchDirection.fromDe);

  private searchModeSubject = new BehaviorSubject<SearchMode>(SearchMode.start);

  private includeVerbsSubject = new BehaviorSubject<boolean>(false);

  constructor(private localStorageService: LocalStorageService) {
    const locale = localStorageService.getItem('locale') as Locale;
    if (locale) {
      this.localeSubject.next(locale);
    }

    const dictionary = localStorageService.getItem('dictionary') as Dictionary;
    if (dictionary) {
      this.dictionarySubject.next(dictionary);
    }

    const searchDirection = localStorageService.getItem('searchDirection') as SearchDirection;
    if (searchDirection) {
      this.searchDirectionSubject.next(searchDirection);
    }

    const searchMode = localStorageService.getItem('searchMode') as SearchMode;
    if (searchMode) {
      this.searchModeSubject.next(searchMode);
    }

    const includeVerbs = JSON.parse(localStorageService.getItem('includeVerbs')) as boolean;
    if (includeVerbs) {
      this.includeVerbsSubject.next(includeVerbs);
    }
  }

  public getLocaleObservable(): Observable<Locale | undefined> {
    return this.localeSubject.asObservable();
  }

  public getSelectedLocale(): Locale | undefined {
    return this.localeSubject.value;
  }

  public setSelectedLocale(locale: Locale) {
    this.localeSubject.next(locale);
    this.localStorageService.setItem('locale', locale);
  }

  public isLocaleSelected(): boolean {
    return !!this.localeSubject.value;
  }

  public getDictionaryObservable(): Observable<Dictionary> {
    return this.dictionarySubject.asObservable();
  }

  public getSelectedDictionary(): Dictionary {
    return this.dictionarySubject.value;
  }

  public setSelectedDictionary(dictionary: Dictionary) {
    this.dictionarySubject.next(dictionary);
    this.localStorageService.setItem('dictionary', dictionary);
  }

  public getSearchDirectionObservable(): Observable<SearchDirection> {
    return this.searchDirectionSubject.asObservable();
  }

  public getSearchDirection(): SearchDirection {
    return this.searchDirectionSubject.value;
  }

  public setSearchDirection(searchDirection: SearchDirection) {
    this.searchDirectionSubject.next(searchDirection);
    this.localStorageService.setItem('searchDirection', searchDirection);
  }

  public getSearchModeObservable(): Observable<SearchMode> {
    return this.searchModeSubject.asObservable();
  }

  public getSearchMode(): SearchMode {
    return this.searchModeSubject.value;
  }

  public setSearchMode(mode: SearchMode) {
    this.searchModeSubject.next(mode);
    this.localStorageService.setItem('searchMode', mode);
  }

  public getIncludeVerbsObservable(): Observable<boolean> {
    return this.includeVerbsSubject.asObservable();
  }

  public isIncludeVerbs(): boolean {
    return this.includeVerbsSubject.value;
  }

  public setIncludeVerbs(includeVerbs: boolean) {
    this.includeVerbsSubject.next(includeVerbs);
    this.localStorageService.setItem('includeVerbs', JSON.stringify(includeVerbs));
  }
}
