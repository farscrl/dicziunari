import { Injectable } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteDBConnection,
  SQLiteConnection,
  capSQLiteSet,
  capSQLiteChanges,
  capSQLiteValues,
  capEchoResult,
  capSQLiteResult,
} from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SQLiteService {
  sqlite: SQLiteConnection;
  isInitializedSubject = new BehaviorSubject<boolean>(false);
  isService = false;
  platform: string;

  constructor() {}
  /**
   * Plugin Initialization
   */
  initializePlugin(): Promise<boolean> {
    return new Promise((resolve) => {
      this.platform = Capacitor.getPlatform();
      console.log('*** platform ' + this.platform);
      const sqlitePlugin: any = CapacitorSQLite;
      this.sqlite = new SQLiteConnection(sqlitePlugin);
      this.isService = true;
      this.isInitializedSubject.next(true);
      console.log('$$$ in service this.isService ' + this.isService + ' $$$');
      resolve(true);
    });
  }

  initWebStore(): Promise<void> {
    return this.sqlite.initWebStore();
  }

  isInitialized(): Observable<boolean> {
    return this.isInitializedSubject.asObservable();
  }

  /**
   * Echo a value
   * @param value
   */
  async echo(value: string): Promise<capEchoResult> {
    console.log('&&&& in echo this.sqlite ' + this.sqlite + ' &&&&');
    if (this.sqlite != null) {
      return await this.sqlite.echo(value);
    } else {
      return null;
    }
  }
  /**
   * addUpgradeStatement
   * @param database
   * @param fromVersion
   * @param toVersion
   * @param statement
   * @param set
   */
  async addUpgradeStatement(
    database: string,
    fromVersion: number,
    toVersion: number,
    statement: string,
    set?: capSQLiteSet[],
  ): Promise<void> {
    if (this.sqlite != null) {
      try {
        await this.sqlite.addUpgradeStatement(database, fromVersion, toVersion, statement, set ? set : []);
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
  /**
   * Create a connection to a database
   * @param database
   * @param encrypted
   * @param mode
   * @param version
   */
  async createConnection(database: string, encrypted: boolean, mode: string, version: number): Promise<SQLiteDBConnection> {
    if (this.sqlite != null) {
      try {
        const db: SQLiteDBConnection = await this.sqlite.createConnection(database, encrypted, mode, version);
        if (db != null) {
          return Promise.resolve(db);
        } else {
          return Promise.reject(new Error(`no db returned is null`));
        }
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
  /**
   * Close a connection to a database
   * @param database
   */
  async closeConnection(database: string): Promise<void> {
    if (this.sqlite != null) {
      try {
        await this.sqlite.closeConnection(database);
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
  /**
   * Retrieve an existing connection to a database
   * @param database
   */
  async retrieveConnection(database: string): Promise<SQLiteDBConnection> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.retrieveConnection(database));
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open for ${database}`));
    }
  }
  /**
   * Retrieve all existing connections
   */
  async retrieveAllConnections(): Promise<Map<string, SQLiteDBConnection>> {
    if (this.sqlite != null) {
      try {
        const myConns = await this.sqlite.retrieveAllConnections();
        let keys = [...myConns.keys()];
        keys.forEach((value) => {
          console.log('Connection: ' + value);
        });
        return Promise.resolve(myConns);
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Close all existing connections
   */
  async closeAllConnections(): Promise<void> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.closeAllConnections());
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Check if connection exists
   * @param database
   */
  async isConnection(database: string): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.isConnection(database));
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Check Connections Consistency
   * @returns
   */
  async checkConnectionsConsistency(): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        console.log(`in Service checkConnectionsConsistency`);
        return Promise.resolve(await this.sqlite.checkConnectionsConsistency());
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Check if database exists
   * @param database
   */
  async isDatabase(database: string): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.isDatabase(database));
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Get the list of databases
   */
  async getDatabaseList(): Promise<capSQLiteValues> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.getDatabaseList());
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Add "SQLite" suffix to old database's names
   */
  async addSQLiteSuffix(folderPath?: string): Promise<void> {
    if (this.sqlite != null) {
      try {
        const path: string = folderPath ? folderPath : 'default';
        console.log(`in service path: ${path} `);
        return Promise.resolve(await this.sqlite.addSQLiteSuffix(folderPath));
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Delete old databases
   */
  async deleteOldDatabases(folderPath?: string): Promise<void> {
    if (this.sqlite != null) {
      try {
        const path: string = folderPath ? folderPath : 'default';
        console.log(`in service path: ${path} `);
        return Promise.resolve(await this.sqlite.deleteOldDatabases(folderPath));
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }

  /**
   * Import from a Json Object
   * @param jsonstring
   */
  async importFromJson(jsonstring: string): Promise<capSQLiteChanges> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.importFromJson(jsonstring));
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Is Json Object Valid
   * @param jsonstring Check the validity of a given Json Object
   */
  async isJsonValid(jsonstring: string): Promise<capSQLiteResult> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.isJsonValid(jsonstring));
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
  /**
   * Copy databases from public/assets/databases folder to application databases folder
   */
  async copyFromAssets(): Promise<void> {
    if (this.sqlite != null) {
      try {
        return Promise.resolve(await this.sqlite.copyFromAssets());
      } catch (err) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }
  }
}
