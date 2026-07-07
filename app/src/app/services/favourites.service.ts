/* eslint-disable max-len */
import { Injectable, inject } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { IosHeaderCleanerUtil } from "../util/ios-header-cleaner.util";

const DB_NAME_KEY = 'favourites';
const DB_VERSION = 2;

// Base schema for brand new installs (curVersion 0). Registered as the version-1 upgrade step
// below, so the plugin's own version-upgrade mechanism creates it before applying
// migrationV2Commands - this deliberately excludes the columns added in migrationV2Commands,
// otherwise a fresh install would apply both steps and fail on "duplicate column".
const createTableV1Command = `
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
          imperativ1 TEXT,
          imperativ2 TEXT,
          gerundium TEXT,
          last_modified INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `;

const migrationV2Commands = [
  'ALTER TABLE favorites ADD COLUMN RPronunciation TEXT;',
  'ALTER TABLE favorites ADD COLUMN inflectiontype TEXT;',
  'ALTER TABLE favorites ADD COLUMN nounbaseform TEXT;',
  'ALTER TABLE favorites ADD COLUMN nounmsingular TEXT;',
  'ALTER TABLE favorites ADD COLUMN nounmplural TEXT;',
  'ALTER TABLE favorites ADD COLUMN nounfsingular TEXT;',
  'ALTER TABLE favorites ADD COLUMN nounfplural TEXT;',
  'ALTER TABLE favorites ADD COLUMN adjectivebaseform TEXT;',
  'ALTER TABLE favorites ADD COLUMN adjectivemsingular TEXT;',
  'ALTER TABLE favorites ADD COLUMN adjectivefsingular TEXT;',
  'ALTER TABLE favorites ADD COLUMN adjectivemplural TEXT;',
  'ALTER TABLE favorites ADD COLUMN adjectivefplural TEXT;',
  'ALTER TABLE favorites ADD COLUMN adjectiveadverbialform TEXT;',
  'ALTER TABLE favorites ADD COLUMN adjectivepredicative TEXT;',
  'ALTER TABLE favorites ADD COLUMN preschentencliticsing1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN preschentencliticsing2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN preschentencliticsing3m TEXT;',
  'ALTER TABLE favorites ADD COLUMN preschentencliticsing3f TEXT;',
  'ALTER TABLE favorites ADD COLUMN preschentencliticplural1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN preschentencliticplural2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN preschentencliticplural3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperfectencliticsing1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperfectencliticsing2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperfectencliticsing3m TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperfectencliticsing3f TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperfectencliticplural1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperfectencliticplural2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperfectencliticplural3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN conjunctivimperfectsing1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN conjunctivimperfectsing2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN conjunctivimperfectsing3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN conjunctivimperfectplural1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN conjunctivimperfectplural2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN conjunctivimperfectplural3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalencliticsing1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalencliticsing2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalencliticsing3m TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalencliticsing3f TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalencliticplural1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalencliticplural2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalencliticplural3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalindirectsing1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalindirectsing2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalindirectsing3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalindirectplural1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalindirectplural2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN cundizionalindirectplural3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN participperfectmspredicativ TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurencliticsing1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurencliticsing2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurencliticsing3m TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurencliticsing3f TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurencliticplural1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurencliticplural2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurencliticplural3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativsing1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativsing2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativsing3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativplural1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativplural2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativplural3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativencliticsing1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativencliticsing2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativencliticsing3m TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativencliticsing3f TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativencliticplural1 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativencliticplural2 TEXT;',
  'ALTER TABLE favorites ADD COLUMN futurdubitativencliticplural3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperativ3 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperativ4 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperativ5 TEXT;',
  'ALTER TABLE favorites ADD COLUMN imperativ6 TEXT;',
];

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private sqlLiteService = inject(SQLiteService);
  private iosHeaderCleanerUtil = inject(IosHeaderCleanerUtil);

  private isReadySubject = new BehaviorSubject(false);
  private readyPromise: Promise<void>;

  constructor() {
    this.readyPromise = this.setupDatabase();
  }

  isReadyObservable(): Observable<boolean> {
    return this.isReadySubject.asObservable();
  }

  async loadFavourites() {
    await this.readyPromise;

    const statement = 'SELECT * from favorites ORDER BY RStichwort ASC, DStichwort ASC;';
    // console.warn(statement);
    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });
    values.values = this.iosHeaderCleanerUtil.removeIosOnlyHeaderLine(values.values);
    return values.values;
  }

  async addFavorite(dictionary, lemma): Promise<boolean> {
    await this.readyPromise;

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
    INSERT INTO "favorites" ("dictionary", "RStichwort", "RGenus", "RGrammatik", "RFlex", "RSempraez", "RPronunciation", "Corp", "DStichwort", "DGenus", "DGrammatik", "DFlex", "DSempraez", "inflectiontype", "nounbaseform", "nounmsingular", "nounmplural", "nounfsingular", "nounfplural", "adjectivebaseform", "adjectivemsingular", "adjectivefsingular", "adjectivemplural", "adjectivefplural", "adjectiveadverbialform", "adjectivepredicative", "infinitiv", "preschentsing1", "preschentsing2", "preschentsing3", "preschentplural1", "preschentplural2", "preschentplural3", "preschentencliticsing1", "preschentencliticsing2", "preschentencliticsing3m", "preschentencliticsing3f", "preschentencliticplural1", "preschentencliticplural2", "preschentencliticplural3", "imperfectsing1", "imperfectsing2", "imperfectsing3", "imperfectplural1", "imperfectplural2", "imperfectplural3", "imperfectencliticsing1", "imperfectencliticsing2", "imperfectencliticsing3m", "imperfectencliticsing3f", "imperfectencliticplural1", "imperfectencliticplural2", "imperfectencliticplural3", "conjunctivsing1", "conjunctivsing2", "conjunctivsing3", "conjunctivplural1", "conjunctivplural2", "conjunctivplural3", "conjunctivimperfectsing1", "conjunctivimperfectsing2", "conjunctivimperfectsing3", "conjunctivimperfectplural1", "conjunctivimperfectplural2", "conjunctivimperfectplural3", "cundizionalsing1", "cundizionalsing2", "cundizionalsing3", "cundizionalplural1", "cundizionalplural2", "cundizionalplural3", "cundizionalencliticsing1", "cundizionalencliticsing2", "cundizionalencliticsing3m", "cundizionalencliticsing3f", "cundizionalencliticplural1", "cundizionalencliticplural2", "cundizionalencliticplural3", "cundizionalindirectsing1", "cundizionalindirectsing2", "cundizionalindirectsing3", "cundizionalindirectplural1", "cundizionalindirectplural2", "cundizionalindirectplural3", "participperfectfs", "participperfectms", "participperfectfp", "participperfectmp", "participperfectmspredicativ", "futursing1", "futursing2", "futursing3", "futurplural1", "futurplural2", "futurplural3", "futurencliticsing1", "futurencliticsing2", "futurencliticsing3m", "futurencliticsing3f", "futurencliticplural1", "futurencliticplural2", "futurencliticplural3", "futurdubitativsing1", "futurdubitativsing2", "futurdubitativsing3", "futurdubitativplural1", "futurdubitativplural2", "futurdubitativplural3", "futurdubitativencliticsing1", "futurdubitativencliticsing2", "futurdubitativencliticsing3m", "futurdubitativencliticsing3f", "futurdubitativencliticplural1", "futurdubitativencliticplural2", "futurdubitativencliticplural3", "imperativ1", "imperativ2", "imperativ3", "imperativ4", "imperativ5", "imperativ6", "gerundium")
                     VALUES ("${dictionary || 'NULL'}", "${lemma.RStichwort || 'NULL'}", "${lemma.RGenus || 'NULL'}", "${lemma.RGrammatik || 'NULL'}", "${lemma.RFlex || 'NULL'}", "${lemma.RSempraez || 'NULL'}", "${lemma.RPronunciation || 'NULL'}", "${lemma.Corp || 'NULL'}", "${lemma.DStichwort || 'NULL'}", "${lemma.DGenus || 'NULL'}", "${lemma.DGrammatik || 'NULL'}", "${lemma.DFlex || 'NULL'}", "${lemma.DSempraez || 'NULL'}", "${lemma.inflectiontype || 'NULL'}", "${lemma.nounbaseform || 'NULL'}", "${lemma.nounmsingular || 'NULL'}", "${lemma.nounmplural || 'NULL'}", "${lemma.nounfsingular || 'NULL'}", "${lemma.nounfplural || 'NULL'}", "${lemma.adjectivebaseform || 'NULL'}", "${lemma.adjectivemsingular || 'NULL'}", "${lemma.adjectivefsingular || 'NULL'}", "${lemma.adjectivemplural || 'NULL'}", "${lemma.adjectivefplural || 'NULL'}", "${lemma.adjectiveadverbialform || 'NULL'}", "${lemma.adjectivepredicative || 'NULL'}", "${lemma.infinitiv || 'NULL'}", "${lemma.preschentsing1 || 'NULL'}", "${lemma.preschentsing2 || 'NULL'}", "${lemma.preschentsing3 || 'NULL'}", "${lemma.preschentplural1 || 'NULL'}", "${lemma.preschentplural2 || 'NULL'}", "${lemma.preschentplural3 || 'NULL'}", "${lemma.preschentencliticsing1 || 'NULL'}", "${lemma.preschentencliticsing2 || 'NULL'}", "${lemma.preschentencliticsing3m || 'NULL'}", "${lemma.preschentencliticsing3f || 'NULL'}", "${lemma.preschentencliticplural1 || 'NULL'}", "${lemma.preschentencliticplural2 || 'NULL'}", "${lemma.preschentencliticplural3 || 'NULL'}", "${lemma.imperfectsing1 || 'NULL'}", "${lemma.imperfectsing2 || 'NULL'}", "${lemma.imperfectsing3 || 'NULL'}", "${lemma.imperfectplural1 || 'NULL'}", "${lemma.imperfectplural2 || 'NULL'}", "${lemma.imperfectplural3 || 'NULL'}", "${lemma.imperfectencliticsing1 || 'NULL'}", "${lemma.imperfectencliticsing2 || 'NULL'}", "${lemma.imperfectencliticsing3m || 'NULL'}", "${lemma.imperfectencliticsing3f || 'NULL'}", "${lemma.imperfectencliticplural1 || 'NULL'}", "${lemma.imperfectencliticplural2 || 'NULL'}", "${lemma.imperfectencliticplural3 || 'NULL'}", "${lemma.conjunctivsing1 || 'NULL'}", "${lemma.conjunctivsing2 || 'NULL'}", "${lemma.conjunctivsing3 || 'NULL'}", "${lemma.conjunctivplural1 || 'NULL'}", "${lemma.conjunctivplural2 || 'NULL'}", "${lemma.conjunctivplural3 || 'NULL'}", "${lemma.conjunctivimperfectsing1 || 'NULL'}", "${lemma.conjunctivimperfectsing2 || 'NULL'}", "${lemma.conjunctivimperfectsing3 || 'NULL'}", "${lemma.conjunctivimperfectplural1 || 'NULL'}", "${lemma.conjunctivimperfectplural2 || 'NULL'}", "${lemma.conjunctivimperfectplural3 || 'NULL'}", "${lemma.cundizionalsing1 || 'NULL'}", "${lemma.cundizionalsing2 || 'NULL'}", "${lemma.cundizionalsing3 || 'NULL'}", "${lemma.cundizionalplural1 || 'NULL'}", "${lemma.cundizionalplural2 || 'NULL'}", "${lemma.cundizionalplural3 || 'NULL'}", "${lemma.cundizionalencliticsing1 || 'NULL'}", "${lemma.cundizionalencliticsing2 || 'NULL'}", "${lemma.cundizionalencliticsing3m || 'NULL'}", "${lemma.cundizionalencliticsing3f || 'NULL'}", "${lemma.cundizionalencliticplural1 || 'NULL'}", "${lemma.cundizionalencliticplural2 || 'NULL'}", "${lemma.cundizionalencliticplural3 || 'NULL'}", "${lemma.cundizionalindirectsing1 || 'NULL'}", "${lemma.cundizionalindirectsing2 || 'NULL'}", "${lemma.cundizionalindirectsing3 || 'NULL'}", "${lemma.cundizionalindirectplural1 || 'NULL'}", "${lemma.cundizionalindirectplural2 || 'NULL'}", "${lemma.cundizionalindirectplural3 || 'NULL'}", "${lemma.participperfectfs || 'NULL'}", "${lemma.participperfectms || 'NULL'}", "${lemma.participperfectfp || 'NULL'}", "${lemma.participperfectmp || 'NULL'}", "${lemma.participperfectmspredicativ || 'NULL'}", "${lemma.futursing1 || 'NULL'}", "${lemma.futursing2 || 'NULL'}", "${lemma.futursing3 || 'NULL'}", "${lemma.futurplural1 || 'NULL'}", "${lemma.futurplural2 || 'NULL'}", "${lemma.futurplural3 || 'NULL'}", "${lemma.futurencliticsing1 || 'NULL'}", "${lemma.futurencliticsing2 || 'NULL'}", "${lemma.futurencliticsing3m || 'NULL'}", "${lemma.futurencliticsing3f || 'NULL'}", "${lemma.futurencliticplural1 || 'NULL'}", "${lemma.futurencliticplural2 || 'NULL'}", "${lemma.futurencliticplural3 || 'NULL'}", "${lemma.futurdubitativsing1 || 'NULL'}", "${lemma.futurdubitativsing2 || 'NULL'}", "${lemma.futurdubitativsing3 || 'NULL'}", "${lemma.futurdubitativplural1 || 'NULL'}", "${lemma.futurdubitativplural2 || 'NULL'}", "${lemma.futurdubitativplural3 || 'NULL'}", "${lemma.futurdubitativencliticsing1 || 'NULL'}", "${lemma.futurdubitativencliticsing2 || 'NULL'}", "${lemma.futurdubitativencliticsing3m || 'NULL'}", "${lemma.futurdubitativencliticsing3f || 'NULL'}", "${lemma.futurdubitativencliticplural1 || 'NULL'}", "${lemma.futurdubitativencliticplural2 || 'NULL'}", "${lemma.futurdubitativencliticplural3 || 'NULL'}", "${lemma.imperativ1 || 'NULL'}", "${lemma.imperativ2 || 'NULL'}", "${lemma.imperativ3 || 'NULL'}", "${lemma.imperativ4 || 'NULL'}", "${lemma.imperativ5 || 'NULL'}", "${lemma.imperativ6 || 'NULL'}", "${lemma.gerundium || 'NULL'}" );
    `;

    while(statement.includes('"NULL"')) {
      statement = statement.replace('"NULL"', 'NULL');
    }

    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });
    values.values = this.iosHeaderCleanerUtil.removeIosOnlyHeaderLine(values.values);

    if (Capacitor.getPlatform() === 'web') {
      CapacitorSQLite.saveToStore({ database: DB_NAME_KEY });
    }

    if (values.values) {
      return true;
    }
    return false;
  }

  async deleteFavorite(id: number) {
    await this.readyPromise;

    const statement = `
    DELETE FROM favorites WHERE id = ${id};
    `;

    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });
    values.values = this.iosHeaderCleanerUtil.removeIosOnlyHeaderLine(values.values);

    if (Capacitor.getPlatform() === 'web') {
      CapacitorSQLite.saveToStore({ database: DB_NAME_KEY });
    }
    if (values.values) {
      return true;
    }
    return false;
  }

  async deleteAllFavorites() {
    await this.readyPromise;

    const statement = `
    DELETE FROM favorites;
    `;

    const values = await CapacitorSQLite.query({
      database: DB_NAME_KEY,
      statement,
      values: [],
    });
    values.values = this.iosHeaderCleanerUtil.removeIosOnlyHeaderLine(values.values);

    if (Capacitor.getPlatform() === 'web') {
      CapacitorSQLite.saveToStore({ database: DB_NAME_KEY });
    }
    if (values.values) {
      return true;
    }
    return false;
  }

  private async setupDatabase() {
    // Register the full upgrade chain before opening. The plugin replays every registered step
    // whose toVersion is > the database's current version, so a brand new install (curVersion 0)
    // runs both steps in order (1 creates the table, 2 adds the newer columns), while an
    // existing install only replays whichever steps it hasn't already applied.
    await this.sqlLiteService.addUpgradeStatement(DB_NAME_KEY, 1, [createTableV1Command]);
    await this.sqlLiteService.addUpgradeStatement(DB_NAME_KEY, 2, migrationV2Commands);

    // create db connection
    const hasConnection = (await this.sqlLiteService.isConnection(DB_NAME_KEY)).result;
    let db;
    if (hasConnection) {
      db = await this.sqlLiteService.retrieveConnection(DB_NAME_KEY);
    } else {
      db = await this.sqlLiteService.createConnection(DB_NAME_KEY, false, 'no-encryption', DB_VERSION);
    }
    await db.open();

    this.isReadySubject.next(true);
  }
}
