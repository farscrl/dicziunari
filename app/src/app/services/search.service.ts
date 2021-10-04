import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from './sqlite.service';
const DB_NAME_KEY = 'dicziunari';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private isReady = false;

  constructor(private http: HttpClient, private alertCtrl: AlertController, private sqliteService: SQLiteService) {
    this.init();
  }

  async init(): Promise<void> {
    const info = await Device.getInfo();

    if (info.platform === 'android') {
      try {
        const sqlite = CapacitorSQLite as any;
        await sqlite.requestPermissions();
        this.setupDatabase();
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: 'No DB access',
          message: "This app can't work without Database access.",
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      this.setupDatabase();
    }
  }

  async searchTerm(lemma: string) {
    if (!this.isReady) {
      return [];
    }
    const statement =
      "SELECT c.id, c.RStichwort, c.DStichwort FROM rumgr c, rumgr_idx idx WHERE idx.lemma match '" +
      lemma +
      "' and idx.rowId = c.id LIMIT 0,10;";
    console.warn(statement);
    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });
    return values.values;
  }

  private async setupDatabase() {
    // copy db file
    await this.sqliteService.copyFromAssets();

    // create db connection
    const hasConnection = await this.sqliteService.isConnection(DB_NAME_KEY);
    if (hasConnection) {
      await this.sqliteService.createConnection(DB_NAME_KEY, false, 'no-encryption', 1);
    } else {
      await this.sqliteService.retrieveConnection(DB_NAME_KEY);
    }
    await CapacitorSQLite.open({ database: DB_NAME_KEY });
    this.isReady = true;
  }
}
