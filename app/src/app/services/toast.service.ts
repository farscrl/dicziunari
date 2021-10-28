import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController, private translateService: TranslateService) {}

  public async showNotification(stringId: string) {
    this.showToast(stringId, 'primary');
  }

  public async showWarning(stringId: string) {
    this.showToast(stringId, 'warning');
  }

  public async showError(stringId: string) {
    this.showToast(stringId, 'danger');
  }

  private async showToast(stringId: string, color: string) {
    const toast = await this.toastController.create({
      color,
      duration: 3000,
      message: this.translateService.instant(stringId),
    });

    await toast.present();
  }
}
