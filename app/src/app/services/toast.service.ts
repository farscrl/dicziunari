import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController, private translateService: TranslateService) {}

  public async showNotification(stringId: string) {
    this.showToast(stringId, 'dark');
  }

  public async showWarning(stringId: string) {
    this.showToast(stringId, 'dark');
  }

  public async showError(stringId: string) {
    this.showToast(stringId, 'dark');
  }

  private async showToast(stringId: string, color: string) {
    const toast = await this.toastController.create({
      color,
      duration: 5000,
      message: this.translateService.instant(stringId),
    });

    await toast.present();
  }
}
