const fs = require('fs');
const Database = require('better-sqlite3');

const DB_NAME = 'build/dicziunariSQLite.db';
const TABLE_SURSILVAN = 'sursilvan';
// const TABLE_SURSILVAN_IDX = 'sursilvan_idx';
const FILE_PATH = 'data/sursilvan.json';
// const FILE_PATH = 'data/sursilvan_short.json';

let processedEntries = 0;
const columnList = [
    { colName: 'id',                 colType: 'INTEGER PRIMARY KEY' },
    { colName: 'weight',             colType: 'INTEGER' },
    { colName: 'cn_DS',              colType: 'INTEGER' },
    { colName: 'Etymologie',         colType: 'TEXT' },
    { colName: 'Corp',               colType: 'TEXT' },
    { colName: 'Phonetik',           colType: 'TEXT' },
    { colName: 'Phonetik2',          colType: 'TEXT' },
    { colName: 'Redewendung',        colType: 'TEXT' },
    { colName: 'Stichwort',          colType: 'TEXT' },
    { colName: 'StichwortD',         colType: 'TEXT' }, 
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

function parseData() {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    const lemmas = JSON.parse(data)[1].data;
    // console.log(lemmas);

    lemmas.forEach(lemma => {
        lemma['id'] = lemma['cn_DS'];
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
        finalizeDb();
    }
}
