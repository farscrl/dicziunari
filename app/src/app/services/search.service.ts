/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { AlertController } from '@ionic/angular';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { SQLiteService } from './sqlite.service';
import { QueryUtil } from '../util/query.util';
import { ConfigService } from './config.service';
import { IosHeaderCleanerUtil } from "../util/ios-header-cleaner.util";
const DB_NAME_KEY = 'dicziunari';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private isReady = false;

  private searchLemma = '';
  private currentPage = 0;
  private pageSize = 20;
  private hasMoreResults = true;

  constructor(
    private alertCtrl: AlertController,
    private sqlLiteService: SQLiteService,
    private configService: ConfigService,
    private queryUtil: QueryUtil,
    private iosHeaderCleanerUtil: IosHeaderCleanerUtil,
  ) {
    this.sqlLiteService.isInitialized().subscribe((isInitialized) => {
      if (isInitialized) {
        this.init();
      }
    });
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

  async newSearch(lemma: string): Promise<any[]> {
    this.currentPage = 0;
    this.hasMoreResults = true;
    this.searchLemma = lemma;
    return this.getNextPage();
  }

  async getNextResults(): Promise<any[]> {
    this.currentPage++;
    if (!this.hasMoreResults) {
      return Promise.resolve([]);
    }

    return this.getNextPage();
  }

  async getDetails(id: string): Promise<any> {
    const statement = this.queryUtil.getDetailQuery(this.configService.getSelectedDictionary(), id) + ' LIMIT 0,1;';
    // console.warn(statement);
    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });
    values.values = this.iosHeaderCleanerUtil.removeIosOnlyHeaderLine(values.values);
    if (values.values.length < 1) {
      return Promise.resolve({});
    }
    return values.values[0];
  }

  getSearchStatement() {
    return this.queryUtil.getQuery(
      this.configService.getSelectedDictionary(),
      this.configService.getSearchDirection(),
      this.configService.getSearchMode(),
      this.searchLemma,
    );
  }

  async getNextPage(): Promise<any[]> {
    const statement = this.getSearchStatement() + ' LIMIT ' + this.currentPage * this.pageSize + ',' + this.pageSize + ';';

    // console.warn(statement);
    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });
    values.values = this.iosHeaderCleanerUtil.removeIosOnlyHeaderLine(values.values);
    if (values.values.length < 1) {
      this.hasMoreResults = false;
    }
    return values.values;
  }

  private async setupDatabase() {
    // copy db file
    await this.sqlLiteService.copyFromAssets();

    // create db connection
    const hasConnection = await this.sqlLiteService.isConnection(DB_NAME_KEY);
    if (hasConnection) {
      await this.sqlLiteService.createConnection(DB_NAME_KEY, false, 'no-encryption', 1);
    } else {
      await this.sqlLiteService.retrieveConnection(DB_NAME_KEY);
    }
    await CapacitorSQLite.open({ database: DB_NAME_KEY });
    this.isReady = true;
  }
}
