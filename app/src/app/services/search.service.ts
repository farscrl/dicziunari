import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
const DB_NAME_KEY = 'db_name';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private isReady = false;

  constructor(private http: HttpClient, private alertCtrl: AlertController) {
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

  private async setupDatabase() {
    // copy db file
    const sqlitePlugin: any = CapacitorSQLite;
    const sqlite = new SQLiteConnection(sqlitePlugin);
    await sqlite.copyFromAssets();

    // create db connection
    const hasConnection = await sqlite.isConnection('dicziunari');
    if (hasConnection) {
      await sqlite.createConnection('dicziunari', false, 'no-encryption', 1);
    } else {
      await sqlite.retrieveConnection('dicziunari');
    }
    await CapacitorSQLite.open({ database: 'dicziunari' });
    this.isReady = true;
  }

  async searchTerm(lemma: string) {
    if (!this.isReady) {
      return [];
    }
    const statement =
      "SELECT c.RStichwort, c.DStichwort FROM rumgr c, rumgr_idx idx WHERE idx.lemma match '" +
      lemma +
      "' and idx.rowId = c.id LIMIT 0,10;";
    console.warn(statement);
    const values = await CapacitorSQLite.query({
      database: 'dicziunari',
      statement,
      values: [],
    });
    return values.values;
  }
}
