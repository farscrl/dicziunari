const fs = require('fs');
const { chain }  = require('stream-chain');
const  {parser } = require('stream-json');
const { pick }   = require('stream-json/filters/Pick');
const { ignore } = require('stream-json/filters/Ignore');
const { streamArray } = require('stream-json/streamers/StreamArray');
const Database = require('better-sqlite3');
const { exception } = require('console');

const DB_NAME = 'build/dicziunariSQLite.db';
const TABLE_RUMGR = 'rumgr';
const TABLE_RUMGR_IDX = 'rumgr_idx';
const FILE_PATH = 'data/rumantschgrischun_data_json.json';
// const FILE_PATH = 'data/rumantschgrischun_data_json_short.json';

let processedEntries = 0;
const columnList = [
    { colName: 'id',                 colType: 'INTEGER PRIMARY KEY' },
    { colName: 'weight',             colType: 'INTEGER' },

    // R
    { colName: 'RStichwort',         colType: 'TEXT' },
    { colName: 'RGenus',             colType: 'TEXT' },

    // D
    { colName: 'DStichwort',         colType: 'TEXT' },
    { colName: 'DGenus',             colType: 'TEXT' },

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

    db.exec("DROP TABLE IF EXISTS " + TABLE_RUMGR +" ;");
    db.exec("DROP TABLE IF EXISTS " + TABLE_RUMGR_IDX + ";")

    // create used columns
    const columnDef = columnList.map(column => column.colName + ' ' + column.colType).join(", ");
    db.exec("CREATE TABLE " + TABLE_RUMGR + "(" +columnDef + ");");

    // creating virtual fts5 table. Used options:
    // lemma is the search term. content sets the content to another table, content_rowid defines what column that identifies the data in the data-table, columsize defines, that values are not stored seperately in the virtual table
    db.exec("CREATE VIRTUAL TABLE " + TABLE_RUMGR_IDX + " using fts5(lemma, content = '" + TABLE_RUMGR + "', content_rowid = 'id', columnsize=0);");

    // create prepared statement to add each lemma
    insertStatementLemma = db.prepare(
        "INSERT INTO " + TABLE_RUMGR + " ("+ columnList.map(col => col.colName).join(", ")+") " + 
        "VALUES (" + Array.from(columnList).map(column => "$"+column.colName).join(", ")+");");
    insertStatementIdx = db.prepare("INSERT INTO " + TABLE_RUMGR_IDX + " (rowId, lemma) VALUES ($rowId, $lemma);");
    
    // start transaction
    db.exec("BEGIN TRANSACTION;");
}

function createPipeline(filePath) {
    return chain([
        fs.createReadStream(filePath),
        parser(),
        //pick(),
        streamArray(),
        data => {
            return data.value;
        }
    ]);
}

// This function can be used to handle each lemma to check if all columns exported from the json are found
function searchColumnNames(lemma) {
    ++processedEntries;

    for(let property in lemma) {
        if (!columnList.includes(property)) {
            console.error("Colum '" + property + "' missing");
            throw new Error("Column missing!");
        }
    }

    if (processedEntries % 1000 === 0) {
        console.log('Processed ' + processedEntries + ' lemmas');
    }
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

function handleLemma(lemma) {
    //console.log(lemma);

    // filter empty objects
    if (!Object.keys(lemma).length) {
        return;
    }

    ++processedEntries;

    insertLemma(lemma);
    insertIndex(lemma);
    id++;

    if (processedEntries % 1000 === 0) {
        console.log('Processed ' + processedEntries + ' lemmas');
    }
}

function finalizeDb() {
    console.log('Processed ' + processedEntries + ' lemmas');
    console.log('file ended');

    db.exec("COMMIT TRANSACTION;");
    db.close();

    console.log('Conversion ended');
}

function configurePipeline(pipeline) {
    pipeline.on('data', (data) => {
        handleLemma(data);
        // searchColumnNames(data);
    });

    pipeline.on('end', () => {
        finalizeDb();
    });
}

module.exports = {
    main: function () {
        console.log('Start converting JSON file for Rumantsch Grischun...');

        prepareAndCleanDb();

        const pipeline = createPipeline(FILE_PATH);
        configurePipeline(pipeline);
    }
}
