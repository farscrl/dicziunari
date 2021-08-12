import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private selectedLocale;

  constructor(private localStorageService: LocalStorageService) {
    this.selectedLocale = localStorageService.getItem('locale');
  }

  public getSelectedLocale(): string | undefined {
    return this.selectedLocale;
  }

  public setSelectedLocale(locale: string) {
    this.selectedLocale = locale;
    this.localStorageService.setItem('locale', locale);
  }

  public isLocaleSelected(): boolean {
    return !!this.selectedLocale;
  }
}
