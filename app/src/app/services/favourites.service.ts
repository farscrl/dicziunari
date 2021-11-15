/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';

const DB_NAME_KEY = 'favourites';
const initializationCommand = `
      CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          dictionary TEXT,
          RStichwort TEXT,
          RGenus TEXT,
          RFlex TEXT,
          RGrammatik TEXT,
          RSempraez TEXT,
          Corp TEXT,
          Etymologie TEXT,
          DStichwort TEXT,
          DGenus TEXT,
          DFlex TEXT,
          DGrammatik TEXT,
          DSempraez TEXT,
          infinitiv TEXT,
          preschentsing1 TEXT,
          preschentsing2 TEXT,
          preschentsing3 TEXT,
          preschentplural1 TEXT,
          preschentplural2 TEXT,
          preschentplural3 TEXT,
          imperfectsing1 TEXT,
          imperfectsing2 TEXT,
          imperfectsing3 TEXT,
          imperfectplural1 TEXT,
          imperfectplural2 TEXT,
          imperfectplural3 TEXT,
          participperfectfs TEXT,
          participperfectms TEXT,
          participperfectfp TEXT,
          participperfectmp TEXT,
          futursing1 TEXT,
          futursing2 TEXT,
          futursing3 TEXT,
          futurplural1 TEXT,
          futurplural2 TEXT,
          futurplural3 TEXT,
          conjunctivsing1 TEXT,
          conjunctivsing2 TEXT,
          conjunctivsing3 TEXT,
          conjunctivplural1 TEXT,
          conjunctivplural2 TEXT,
          conjunctivplural3 TEXT,
          cundizionalsing1 TEXT,
          cundizionalsing2 TEXT,
          cundizionalsing3 TEXT,
          cundizionalplural1 TEXT,
          cundizionalplural2 TEXT,
          cundizionalplural3 TEXT,
          imperativ1 TEXT,
          imperativ2 TEXT,
          gerundium TEXT,
          last_modified INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `;

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private isReadySubject = new BehaviorSubject(false);

  constructor(private sqlLiteService: SQLiteService) {
    this.setupDatabase();
  }

  isReadyObservable(): Observable<boolean> {
    return this.isReadySubject.asObservable();
  }

  async loadFavourites() {
    if (!this.isReadySubject.value) {
      return Promise.resolve([]);
    }
    const statement = 'SELECT * from favorites ORDER BY id DESC;';
    console.warn(statement);
    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });

    return values.values;
  }

  async addFavorite(dictionary, lemma): Promise<boolean> {
    if (lemma.Corp) {
      lemma.Corp = lemma.Corp.replace(/"/g, '""');
    }
    if (lemma.RStichwort) {
      lemma.RStichwort = lemma.RStichwort.replace(/"/g, '""');
    }
    if (lemma.DStichwort) {
      lemma.DStichwort = lemma.DStichwort.replace(/"/g, '""');
    }

    let statement = `
    INSERT INTO "favorites" ("dictionary",              "RStichwort",                    "RGenus",                    "RGrammatik",                    "RFlex",                    "RSempraez",                    "Corp",                    "DStichwort",                    "DGenus",                    "DGrammatik",                    "DFlex",                    "DSempraez",                    "infinitiv",                    "preschentsing1",                    "preschentsing2",                    "preschentsing3",                    "preschentplural1",                    "preschentplural2",                    "preschentplural3",                    "imperfectsing1",                    "imperfectsing2",                    "imperfectsing3",                    "imperfectplural1",                    "imperfectplural2",                    "imperfectplural3",                    "participperfectfs",                    "participperfectms",                    "participperfectfp",                    "participperfectmp",                    "futursing1",                    "futursing2",                    "futursing3",                    "futurplural1",                    "futurplural2",                    "futurplural3",                    "conjunctivsing1",                    "conjunctivsing2",                    "conjunctivsing3",                    "conjunctivplural1",                    "conjunctivplural2",                    "conjunctivplural3",                    "cundizionalsing1",                    "cundizionalsing2",                    "cundizionalsing3",                    "cundizionalplural1",                    "cundizionalplural2",                    "cundizionalplural3",                    "imperativ1",                    "imperativ2",                    "gerundium")
                     VALUES ("${dictionary || 'NULL'}", "${lemma.RStichwort || 'NULL'}", "${lemma.RGenus || 'NULL'}", "${lemma.RGrammatik || 'NULL'}", "${lemma.RFlex || 'NULL'}", "${lemma.RSempraez || 'NULL'}", "${lemma.Corp || 'NULL'}", "${lemma.DStichwort || 'NULL'}", "${lemma.DGenus || 'NULL'}", "${lemma.DGrammatik || 'NULL'}", "${lemma.DFlex || 'NULL'}", "${lemma.DSempraez || 'NULL'}", "${lemma.infinitiv || 'NULL'}", "${lemma.preschentsing1 || 'NULL'}", "${lemma.preschentsing2 || 'NULL'}", "${lemma.preschentsing3 || 'NULL'}", "${lemma.preschentplural1 || 'NULL'}", "${lemma.preschentplural2 || 'NULL'}", "${lemma.preschentplural3 || 'NULL'}", "${lemma.imperfectsing1 || 'NULL'}", "${lemma.imperfectsing2 || 'NULL'}", "${lemma.imperfectsing3 || 'NULL'}", "${lemma.imperfectplural1 || 'NULL'}", "${lemma.imperfectplural2 || 'NULL'}", "${lemma.imperfectplural3 || 'NULL'}", "${lemma.participperfectfs || 'NULL'}", "${lemma.participperfectms || 'NULL'}", "${lemma.participperfectfp || 'NULL'}", "${lemma.participperfectmp || 'NULL'}", "${lemma.futursing1 || 'NULL'}", "${lemma.futursing2 || 'NULL'}", "${lemma.futursing3 || 'NULL'}", "${lemma.futurplural1 || 'NULL'}", "${lemma.futurplural2 || 'NULL'}", "${lemma.futurplural3 || 'NULL'}", "${lemma.conjunctivsing1 || 'NULL'}", "${lemma.conjunctivsing2 || 'NULL'}", "${lemma.conjunctivsing3 || 'NULL'}", "${lemma.conjunctivplural1 || 'NULL'}", "${lemma.conjunctivplural2 || 'NULL'}", "${lemma.conjunctivplural3 || 'NULL'}", "${lemma.cundizionalsing1 || 'NULL'}", "${lemma.cundizionalsing2 || 'NULL'}", "${lemma.cundizionalsing3 || 'NULL'}", "${lemma.cundizionalplural1 || 'NULL'}", "${lemma.cundizionalplural2 || 'NULL'}", "${lemma.cundizionalplural3 || 'NULL'}", "${lemma.imperativ1 || 'NULL'}", "${lemma.imperativ2 || 'NULL'}", "${lemma.gerundium || 'NULL'}" );
    `;

    while(statement.includes('"NULL"')) {
      statement = statement.replace('"NULL"', 'NULL');
    }

    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });

    if (Capacitor.getPlatform() === 'web') {
      CapacitorSQLite.saveToStore({ database: DB_NAME_KEY });
    }

    if (values.values) {
      return true;
    }
    return false;
  }

  async deleteFavorite(id: number) {
    const statement = `
    DELETE FROM favorites WHERE id = ${id};
    `;

    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });

    if (Capacitor.getPlatform() === 'web') {
      CapacitorSQLite.saveToStore({ database: DB_NAME_KEY });
    }
    if (values.values) {
      return true;
    }
    return false;
  }

  private async setupDatabase() {
    // create db connection
    const hasConnection = await this.sqlLiteService.isConnection(DB_NAME_KEY);
    let db;
    if (hasConnection) {
      db = await this.sqlLiteService.createConnection(DB_NAME_KEY, false, 'no-encryption', 1);
    } else {
      db = await this.sqlLiteService.retrieveConnection(DB_NAME_KEY);
    }
    await db.open();

    const ret: any = await db.execute(initializationCommand);
    if (ret.changes.changes < 0) {
      return Promise.reject(new Error('Execute initializationCommand failed'));
    }

    this.isReadySubject.next(true);
  }
}
