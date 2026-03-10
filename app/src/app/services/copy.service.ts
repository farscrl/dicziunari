import { Injectable, inject } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CopyService {
  private toastService = inject(ToastService);

  public async copyItem(lemmaDe: string, lemmaRm: string) {
    await Clipboard.write({
      // eslint-disable-next-line id-blacklist
      string: lemmaDe + ' / ' + lemmaRm,
    });

    await this.toastService.showNotification('SEARCH.RESULTS.COPIED');
  }
}
