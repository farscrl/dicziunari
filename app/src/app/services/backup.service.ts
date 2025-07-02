import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { FilePicker, PickDirectoryResult, PickedFile } from '@capawesome/capacitor-file-picker';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FavouritesService } from './favourites.service';
import * as XLSX from 'xlsx';
import { WorkBook } from 'xlsx';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  constructor(
      private favouritesService: FavouritesService,
      private toastService: ToastService,
  ) { }

  async importBackup(importMode: string) {
    const platform = Capacitor.getPlatform();

    switch (platform) {
      case 'android':
        await this.importBackupAndroid(importMode);
        break;
      case 'ios':
        await this.importBackupIos(importMode);
        return null;
      default:
        await this.importBackupWeb(importMode);
    }
  }

  async exportBackup() {
    const favorites = await this.favouritesService.loadFavourites();
    const worksheet = XLSX.utils.json_to_sheet(favorites);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'export dicziunari');
    const binaryData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    const buffer = new ArrayBuffer(binaryData.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binaryData.length; i++) {
      view[i] = binaryData.charCodeAt(i) & 0xFF;
    }

    const fileName = `export_dicziunari_${this.getFormattedDate()}.xlsx`;

    const platform = Capacitor.getPlatform();
    switch (platform) {
      case 'android':
        await this.exportBackupAndroid(view, fileName);
        break;
      case 'ios':
        await this.exportBackupIos(view, fileName);
        break;
      default:
        await this.exportBackupWeb(view, fileName);
    }
  }

  private async exportBackupAndroid(data: Uint8Array, fileName: string) {
    try {
      const base64Data = this.binaryStringToBase64(data);

      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });
      console.log('File saved successfully!');
      await this.toastService.showNotification('BACKUP.EXPORT.SUCCESS');
    } catch (e) {
      console.error('Unable to write file', e);
      await this.toastService.showNotification('BACKUP.EXPORT.ERROR');
    }
  }

  private async exportBackupIos(data: Uint8Array, fileName: string) {
    try {
      const base64Data = this.binaryStringToBase64(data);

      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: fileName,
        files: [result.uri],
      });
      await this.toastService.showNotification('BACKUP.EXPORT.SUCCESS');
    } catch (error) {
      console.error('Unable to export data on iOS', error);
      await this.toastService.showNotification('BACKUP.EXPORT.ERROR');
    }
  }

  private async exportBackupWeb(data: Uint8Array, fileName: string) {
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([data], { type: 'application/octet-stream' }));
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    await this.toastService.showNotification('BACKUP.EXPORT.SUCCESS');
  }

  private async importBackupAndroid(importMode: string) {
    try {
      const { files }: { files: PickedFile[] } = await FilePicker.pickFiles({
        types: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        limit: 1,
      });

      if (!files || files.length === 0) {
        console.log('User cancelled file selection.');
        await this.toastService.showError('BACKUP.IMPORT.ERROR');
        return null;
      }

      const selectedFile = files[0];
      const filePath = selectedFile.path;
      if (!filePath) {
        console.error('File path not available.');
        await this.toastService.showError('BACKUP.IMPORT.ERROR');
        return null;
      }

      const fileContent = await Filesystem.readFile({
        path: filePath,
      });

      const workbook = XLSX.read(fileContent.data, { type: 'base64' });
      await this.finishImport(workbook, importMode);
    } catch (error) {
      console.error('Error importing data on Android:', error);
      await this.toastService.showError('BACKUP.IMPORT.ERROR');
      return null;
    }
  }

  private async importBackupIos(importMode: string) {
    try {
      const { files }: { files: PickedFile[] } = await FilePicker.pickFiles({
        limit: 1,
      });

      if (!files || files.length === 0) {
        console.log('User cancelled file selection.');
        return null;
      }

      const selectedFile = files[0];
      const filePath = selectedFile.path;

      if (!filePath) {
        console.error('File path not available.');
        await this.toastService.showError('BACKUP.IMPORT.ERROR');
        return null;
      }

      const fileContent = await Filesystem.readFile({
        path: filePath,
      });

      const workbook = XLSX.read(fileContent.data, { type: 'base64' });
      await this.finishImport(workbook, importMode);
    } catch (error) {
      console.error('Error importing data on iOS:', error);
      await this.toastService.showError('BACKUP.IMPORT.ERROR');
      return null;
    }
  }

  private importBackupWeb(importMode: string) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (event) => this.executeImportWeb(event as Event & { target: HTMLInputElement }, importMode), false);
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  private getFormattedDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }



  private executeImportWeb(event: Event & { target: HTMLInputElement }, importMode: string) {
    if (importMode === 'overwrite') {
      this.favouritesService.deleteAllFavorites();
    }

    const file = event.target.files![0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      await this.finishImport(workbook, importMode);
    };
    reader.readAsArrayBuffer(file);
  }

  private async finishImport(workbook: WorkBook, importMode: string) {
    if (importMode === 'overwrite') {
      this.favouritesService.deleteAllFavorites();
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    for (let i = jsonData.length - 1; i >= 0; i--) {
      const lemmaToAdd = jsonData[i] as any;
      if (lemmaToAdd) {
        await this.favouritesService.addFavorite(lemmaToAdd.dictionary, lemmaToAdd);
      }
    }
    await this.toastService.showNotification('BACKUP.IMPORT.SUCCESS');
  }

  /**
   * Helper function to convert a Uint8Array to base64.
   */
  private binaryStringToBase64(array: Uint8Array): string {
    return window.btoa(new Uint8Array(array).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  }
}
