const fs = require('fs');
const Database = require('better-sqlite3');

const DB_NAME = 'build/dicziunariSQLite.db';
const TABLE_SURSILVAN = 'sursilvan';
// const TABLE_SURSILVAN_IDX = 'sursilvan_idx';
const FILE_PATH = 'data/sursilvan.json';
const VERB_FILE_PATH = 'data/sursilvan_verbs.json';
// const FILE_PATH = 'data/sursilvan_short.json';
// const VERB_FILE_PATH = 'data/sursilvan_verbs_short.json';

let processedEntries = 0;
const columnList = [
    { colName: 'id',                 colType: 'INTEGER PRIMARY KEY' },
    { colName: 'Etymologie',         colType: 'TEXT' },
    { colName: 'Corp',               colType: 'TEXT' },
    { colName: 'Redewendung',        colType: 'TEXT' },
    { colName: 'RStichwort',         colType: 'TEXT' },
    { colName: 'DStichwort',         colType: 'TEXT' },

    // R conj
    { colName: 'infinitiv',          colType: 'TEXT' },
    { colName: 'preschentsing1',     colType: 'TEXT' },
    { colName: 'preschentsing2',     colType: 'TEXT' },
    { colName: 'preschentsing3',     colType: 'TEXT' },
    { colName: 'preschentplural1',   colType: 'TEXT' },
    { colName: 'preschentplural2',   colType: 'TEXT' },
    { colName: 'preschentplural3',   colType: 'TEXT' },
    { colName: 'imperfectsing1',     colType: 'TEXT' },
    { colName: 'imperfectsing2',     colType: 'TEXT' },
    { colName: 'imperfectsing3',     colType: 'TEXT' },
    { colName: 'imperfectplural1',   colType: 'TEXT' },
    { colName: 'imperfectplural2',   colType: 'TEXT' },
    { colName: 'imperfectplural3',   colType: 'TEXT' },
    { colName: 'participperfectfs',  colType: 'TEXT' },
    { colName: 'participperfectms',  colType: 'TEXT' },
    { colName: 'participperfectfp',  colType: 'TEXT' },
    { colName: 'participperfectmp',  colType: 'TEXT' },
    { colName: 'futursing1',         colType: 'TEXT' },
    { colName: 'futursing2',         colType: 'TEXT' },
    { colName: 'futursing3',         colType: 'TEXT' },
    { colName: 'futurplural1',       colType: 'TEXT' },
    { colName: 'futurplural2',       colType: 'TEXT' },
    { colName: 'futurplural3',       colType: 'TEXT' },
    { colName: 'conjunctivsing1',    colType: 'TEXT' },
    { colName: 'conjunctivsing2',    colType: 'TEXT' },
    { colName: 'conjunctivsing3',    colType: 'TEXT' },
    { colName: 'conjunctivplural1',  colType: 'TEXT' },
    { colName: 'conjunctivplural2',  colType: 'TEXT' },
    { colName: 'conjunctivplural3',  colType: 'TEXT' },
    { colName: 'cundizionalsing1',   colType: 'TEXT' },
    { colName: 'cundizionalsing2',   colType: 'TEXT' },
    { colName: 'cundizionalsing3',   colType: 'TEXT' },
    { colName: 'cundizionalplural1', colType: 'TEXT' },
    { colName: 'cundizionalplural2', colType: 'TEXT' },
    { colName: 'cundizionalplural3', colType: 'TEXT' },
    { colName: 'imperativ1',         colType: 'TEXT' },
    { colName: 'imperativ2',         colType: 'TEXT' },
    { colName: 'gerundium',          colType: 'TEXT' },
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

    db.exec("DROP TABLE IF EXISTS " + TABLE_SURSILVAN +" ;");
    // db.exec("DROP TABLE IF EXISTS " + TABLE_SURSILVAN_IDX + ";")

    // create used columns
    const columnDef = columnList.map(column => column.colName + ' ' + column.colType).join(", ");
    db.exec("CREATE TABLE " + TABLE_SURSILVAN + "(" +columnDef + ");");
    db.exec("CREATE INDEX sursilvan_RStichwort_index ON sursilvan (RStichwort COLLATE NOCASE);");
    db.exec("CREATE INDEX sursilvan_DStichwort_index ON sursilvan (DStichwort COLLATE NOCASE);");
    db.exec("CREATE INDEX sursilvan_Corp_index ON sursilvan (Corp COLLATE NOCASE);");

    // creating virtual fts5 table. Used options:
    // lemma is the search term. content sets the content to another table, content_rowid defines what column that identifies the data in the data-table, columsize defines, that values are not stored seperately in the virtual table
    // db.exec("CREATE VIRTUAL TABLE " + TABLE_SURSILVAN_IDX + " using fts5(lemma, content = '" + TABLE_SURSILVAN + "', content_rowid = 'id', columnsize=0);");

    // create prepared statement to add each lemma
    insertStatementLemma = db.prepare(
        "INSERT INTO " + TABLE_SURSILVAN + " ("+ columnList.map(col => col.colName).join(", ")+") " + 
        "VALUES (" + Array.from(columnList).map(column => "$"+column.colName).join(", ")+");");
    // insertStatementIdx = db.prepare("INSERT INTO " + TABLE_SURSILVAN_IDX + " (rowId, lemma) VALUES ($rowId, $lemma);");
    
    // start transaction
    db.exec("BEGIN TRANSACTION;");
}

function insertLemma(lemma) {
    var binds = {};
    binds['id'] = id;
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

function parseData() {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    const lemmas = JSON.parse(data)[1].data;
    // console.log(lemmas);

    lemmas.forEach(lemma => {
        lemma['id'] = lemma['cn_DS'];
        normalizeLemma(lemma);
        insertLemma(lemma);
        // insertIndex(lemma);

        processedEntries++;
        if (processedEntries % 100 === 0) {
            console.log('Processed ' + processedEntries + ' lemmas');
        }
    });
}

function parseVerbData() {
    const data = fs.readFileSync(VERB_FILE_PATH, 'utf8');
    const lemmas = JSON.parse(data);
    // console.log(lemmas);

    lemmas.forEach((lemma, idx) => {
        lemma['id'] = 100000 + idx;
        normalizeVerb(lemma);
        insertLemma(lemma);
        // insertIndex(lemma);

        processedEntries++;
        if (processedEntries % 100 === 0) {
            console.log('Processed ' + processedEntries + ' lemmas');
        }
    });
}

function normalizeLemma(lemma) {
    lemma['RStichwort'] = replaceEnding(lemma['RStichwort'], ' III');
    lemma['RStichwort'] = replaceEnding(lemma['RStichwort'], ' II');
    lemma['RStichwort'] = replaceEnding(lemma['RStichwort'], ' I');
    lemma['RStichwort'] = replaceEnding(lemma['RStichwort'], ' VI');
    lemma['RStichwort'] = replaceEnding(lemma['RStichwort'], ' V');
    lemma['RStichwort'] = replaceEnding(lemma['RStichwort'], '*');

    lemma['Corp'] = lemma['Corp'].replace(/~/g, lemma['RStichwort']);
}

function normalizeVerb(lemma) {
    lemma['DStichwort'] = lemma['DStichwortList'];
    delete lemma['DStichwortList'];
}


function replaceEnding(string, ending) {
    if (string.endsWith(ending)) {
        return string.slice(0, -ending.length);
    }

    return string;
}

function finalizeDb() {
    console.log('Processed ' + processedEntries + ' lemmas');
    console.log('file ended');

    db.exec("COMMIT TRANSACTION;");
    db.close();
    console.log('Conversion ended');
}

module.exports = {
    main: function () {
        console.log('Start converting JSON file for Sursilvan...');

        prepareAndCleanDb();
        parseData();
        parseVerbData();
        finalizeDb();
    }
}
