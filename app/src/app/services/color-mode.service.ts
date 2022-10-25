import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ColorMode = 'auto' | 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ColorModeService {
  public isDarkModeSubject = new BehaviorSubject<boolean>(false);

  private prefDark = window.matchMedia('(prefers-color-scheme: dark)');

  private LOCAL_STORAGE_KEY = 'color-mode';

  constructor() {
    this.setMode(this.getMode());

    // Change between light/dark theme based on device settings
    if (this.getMode() === 'auto') {
      this.isDarkModeSubject.next(this.prefDark.matches);
      this.listenToColorModeChanges();
    }
  }

  private applyColorModeChanges (event: any) {
    this.isDarkModeSubject.next(event.matches);
  }

  private listenToColorModeChanges() {
    this.prefDark.addEventListener('change', this.applyColorModeChanges.bind(this));
  }

  private removeColorModeChangesListener() {
    this.prefDark.removeEventListener('change', this.applyColorModeChanges.bind(this));
  }

  setMode(colorMode: ColorMode) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, colorMode);

    switch (colorMode) {
      case 'auto':
        this.isDarkModeSubject.next(this.prefDark.matches);
        this.listenToColorModeChanges();
        break;

      case 'dark':
        this.isDarkModeSubject.next(true);
        this.removeColorModeChangesListener();
        break;

      case 'light':
        this.isDarkModeSubject.next(false);
        this.removeColorModeChangesListener();
        break;

      default:
        break;
    }
  };

  getMode(): ColorMode {
    return localStorage.getItem(this.LOCAL_STORAGE_KEY) as ColorMode ?? 'auto';
  }
}
