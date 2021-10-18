const fs = require('fs');
const Database = require('better-sqlite3');
const parser = require('node-html-parser');

const DB_NAME = 'build/dicziunariSQLite.db';
const TABLE_VALLADER = 'vallader';
// const TABLE_VALLADER_IDX = 'vallader_idx';
const FILE_PATH = 'data/vallader.htm';
// const FILE_PATH = 'data/vallader_short.htm';

let processedEntries = 0;
const columnList = [
    { colName: 'id',                 colType: 'INTEGER PRIMARY KEY' },
    { colName: 'weight',             colType: 'INTEGER' },

    // R
    { colName: 'FlexR',              colType: 'TEXT' },
    { colName: 'fStichwortRAnzeige', colType: 'TEXT' },
    { colName: 'GenusR',             colType: 'TEXT' },
    { colName: 'GrammatikR',         colType: 'TEXT' },
    { colName: 'SemindR',            colType: 'TEXT' },
    { colName: 'SempraezR',          colType: 'TEXT' },
    { colName: 'SortR',              colType: 'TEXT' },
    { colName: 'StichwortR',         colType: 'TEXT' },
    { colName: 'StatusR',            colType: 'TEXT' },

    // D
    { colName: 'FlexD',                colType: 'TEXT' },
    { colName: 'GenusD',               colType: 'TEXT' },
    { colName: 'Grammatik_kategorieD', colType: 'TEXT' },
    { colName: 'GrammatikD',           colType: 'TEXT' },
    { colName: 'SemindD',              colType: 'TEXT' },
    { colName: 'SempraezD',            colType: 'TEXT' },
    { colName: 'SortD',                colType: 'TEXT' },
    { colName: 'StichwortD',           colType: 'TEXT' },
    { colName: 'StatusD',              colType: 'TEXT' },
];

let db;
let insertStatementLemma;
let insertStatementIdx;
let id = 1;

function prepareAndCleanDb() {
    db = new Database(DB_NAME);

    //speedup for sqlite inserts
    //as seen on http://blog.quibb.org/2010/08/fast-bulk-inserts-into-sqlite/
    db.pragma("synchronous=OFF");
    db.pragma("count_changes=OFF");
    db.pragma("journal_mode=MEMORY");
    db.pragma("temp_store=MEMORY");

    db.exec("DROP TABLE IF EXISTS " + TABLE_VALLADER +" ;");
    // db.exec("DROP TABLE IF EXISTS " + TABLE_VALLADER_IDX + ";")

    // create used columns
    const columnDef = columnList.map(column => column.colName + ' ' + column.colType).join(", ");
    db.exec("CREATE TABLE " + TABLE_VALLADER + "(" +columnDef + ");");

    // creating virtual fts5 table. Used options:
    // lemma is the search term. content sets the content to another table, content_rowid defines what column that identifies the data in the data-table, columsize defines, that values are not stored seperately in the virtual table
    // db.exec("CREATE VIRTUAL TABLE " + TABLE_VALLADER_IDX + " using fts5(lemma, content = '" + TABLE_VALLADER + "', content_rowid = 'id', columnsize=0);");

    // create prepared statement to add each lemma
    insertStatementLemma = db.prepare(
        "INSERT INTO " + TABLE_VALLADER + " ("+ columnList.map(col => col.colName).join(", ")+") " + 
        "VALUES (" + Array.from(columnList).map(column => "$"+column.colName).join(", ")+");");
    // insertStatementIdx = db.prepare("INSERT INTO " + TABLE_VALLADER_IDX + " (rowId, lemma) VALUES ($rowId, $lemma);");
    
    // start transaction
    db.exec("BEGIN TRANSACTION;");
}

function calculateWeight(lemma) {
    // TODO: implement algorithm for weight
    return 1;
}

function insertLemma(lemma) {
    var binds = {};
    binds['id'] = id;
    binds['weight'] = calculateWeight(lemma);
    columnList.forEach(column => binds[column.colName] = lemma[column.colName]);
    insertStatementLemma.run(binds);
}

function insertIndex(lemma) {
    var binds = {};
    binds["rowId"] = id;
    binds["lemma"] = lemma.RStichwort;
    insertStatementIdx.run(binds);
    binds["lemma"] = lemma.DStichwort;
    insertStatementIdx.run(binds);
}

function finalizeDb() {
    console.log('Processed ' + processedEntries + ' lemmas');
    console.log('file ended');

    db.exec("COMMIT TRANSACTION;");
    db.close();

    console.log('Conversion ended');
}

function parseData() {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    const root = parser.parse(data);

    let processedEntries = 0;

    // iterate rows
    root.querySelector('table').childNodes.forEach(node => {
        if (node.nodeType != 1) {
            return;
        }

        var lemma = {};
        lemma['id'] = processedEntries;

        // iterate single values
        node.childNodes.forEach((value, idx) => {
            if (value.nodeType != 1) {
                return;
            }
            
            switch(idx) {
                case 1:
                    lemma['FlexD'] = value.rawText;
                case 3:
                    lemma['FlexR'] = value.rawText;
                case 5:
                    lemma['fStichwortRAnzeige'] = value.rawText;
                case 7:
                    lemma['GenusD'] = value.rawText;
                case 9:
                    lemma['GenusR'] = value.rawText;
                case 11:
                    lemma['Grammatik_kategorieD'] = value.rawText;
                case 13:
                    lemma['GrammatikD'] = value.rawText;
                case 15:
                    lemma['GrammatikR'] = value.rawText;
                case 17:
                    lemma['SemindD'] = value.rawText;
                case 19:
                    lemma['SemindR'] = value.rawText;
                case 21:
                    lemma['SempraezD'] = value.rawText;
                case 23:
                    lemma['SempraezR'] = value.rawText;
                case 25:
                    lemma['SortD'] = value.rawText;
                case 27:
                    lemma['SortR'] = value.rawText;
                case 29:
                    lemma['StichwortD'] = value.rawText;
                case 31:
                    lemma['StichwortR'] = value.rawText;
                case 33:
                    lemma['StatusD'] = value.rawText;
                case 35:
                    lemma['StatusR'] = value.rawText;
            }
        });

        insertLemma(lemma);
        // insertIndex(lemma);

        processedEntries++;
        if (processedEntries % 100 === 0) {
            console.log('Processed ' + processedEntries + ' lemmas');
        }
    });
}

function calculateWeight(lemma) {
    // TODO: implement algorithm for weight
    return 1;
}

function insertLemma(lemma) {
    var binds = {};
    binds['id'] = id;
    binds['weight'] = calculateWeight(lemma);
    columnList.forEach(column => binds[column.colName] = lemma[column.colName]);
    insertStatementLemma.run(binds);
}

module.exports = {
    main: function () {
        console.log('Start converting HTML file for Vallader...');
        prepareAndCleanDb();
        parseData();
        finalizeDb();
    }
}
