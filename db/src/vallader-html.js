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

    // R
    { colName: 'RFlex',                colType: 'TEXT' },
    { colName: 'RGenus',               colType: 'TEXT' },
    { colName: 'RGrammatik',           colType: 'TEXT' },
    { colName: 'RSempraez',            colType: 'TEXT' },
    { colName: 'RStichwort',           colType: 'TEXT' },

    // D
    { colName: 'DFlex',                colType: 'TEXT' },
    { colName: 'DGenus',               colType: 'TEXT' },
    { colName: 'DGrammatik',           colType: 'TEXT' },
    { colName: 'DSempraez',            colType: 'TEXT' },
    { colName: 'DStichwort',           colType: 'TEXT' },
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
    db.exec("CREATE INDEX vallader_RStichwort_index ON vallader (RStichwort COLLATE NOCASE);");
    db.exec("CREATE INDEX vallader_DStichwort_index ON vallader (DStichwort COLLATE NOCASE);");

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
                    lemma['DFlex'] = value.rawText;
                case 3:
                    lemma['RFlex'] = value.rawText;
                case 5:
                    lemma['fStichwortRAnzeige'] = value.rawText;
                case 7:
                    lemma['DGenus'] = value.rawText;
                case 9:
                    lemma['RGenus'] = value.rawText;
                case 11:
                    lemma['Grammatik_kategorieD'] = value.rawText;
                case 13:
                    lemma['DGrammatik'] = value.rawText;
                case 15:
                    lemma['RGrammatik'] = value.rawText;
                case 17:
                    lemma['DSemind'] = value.rawText;
                case 19:
                    lemma['RSemind'] = value.rawText;
                case 21:
                    lemma['DSempraez'] = value.rawText;
                case 23:
                    lemma['RSempraez'] = value.rawText;
                case 25:
                    lemma['DSort'] = value.rawText;
                case 27:
                    lemma['RSort'] = value.rawText;
                case 29:
                    lemma['DStichwort'] = value.rawText;
                case 31:
                    lemma['RStichwort'] = value.rawText;
                case 33:
                    lemma['DStatus'] = value.rawText;
                case 35:
                    lemma['RStatus'] = value.rawText;
            }
        });
        if (!!lemma['RStichwort'] && !!lemma['DStichwort']) {
            insertLemma(lemma);
            // insertIndex(lemma);
        }

        processedEntries++;
        if (processedEntries % 100 === 0) {
            console.log('Processed ' + processedEntries + ' lemmas');
        }
    });
}

module.exports = {
    main: function () {
        console.log('Start converting HTML file for Vallader...');
        prepareAndCleanDb();
        parseData();
        finalizeDb();
    }
}
