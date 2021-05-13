const fs = require('fs');
const { chain }  = require('stream-chain');
const  {parser } = require('stream-json');
const { pick }   = require('stream-json/filters/Pick');
const { ignore } = require('stream-json/filters/Ignore');
const { streamArray } = require('stream-json/streamers/StreamArray');
const Database = require('better-sqlite3');

const DB_NAME = 'build/dicziunari.db';
const TABLE_RUMGR = 'rumgr';
const FILE_PATH = 'data/rumantschgrischun_data_json.json';
// const FILE_PATH = 'data/rumantschgrischun_data_json_short.json';

let processedEntries = 0;
const columnList = [
    // R
    'RStichwort',
    'RGenus',

    // D
    'DStichwort',
    'DGenus',

    // R conj
    'infinitiv',
    'preschentsing1',
    'preschentsing2',
    'preschentsing3',
    'preschentplural1',
    'preschentplural2',
    'preschentplural3',
    'imperfectsing1',
    'imperfectsing2',
    'imperfectsing3',
    'imperfectplural1',
    'imperfectplural2',
    'imperfectplural3',
    'participperfectfs',
    'participperfectms',
    'participperfectfp',
    'participperfectmp',
    'futursing1',
    'futursing2',
    'futursing3',
    'futurplural1',
    'futurplural2',
    'futurplural3',
    'conjunctivsing1',
    'conjunctivsing2',
    'conjunctivsing3',
    'conjunctivplural1',
    'conjunctivplural2',
    'conjunctivplural3',
    'cundizionalsing1',
    'cundizionalsing2',
    'cundizionalsing3',
    'cundizionalplural1',
    'cundizionalplural2',
    'cundizionalplural3',
    'imperativ1',
    'imperativ2',
    'gerundium',
];

let db;
let insertStatementLemma;

function prepareAndCleanDb() {
    db = new Database(DB_NAME);

    db.pragma("synchronous=OFF");
    db.pragma("count_changes=OFF");
    db.pragma("journal_mode=MEMORY");
    db.pragma("temp_store=MEMORY");
    db.exec("DROP TABLE IF EXISTS " + TABLE_RUMGR +" ;");

    // create used columns
    const columnDef = Array.from(columnList).map(column => column + " TEXT").join(", ");
    db.exec("CREATE TABLE " + TABLE_RUMGR + "(" +columnDef + ");");

    // create prepared statement to add each lemma
    insertStatementLemma = db.prepare(
        "INSERT INTO " + TABLE_RUMGR + " ("+ columnList.join(", ")+") " + 
        "VALUES ("+Array.from(columnList).map(column => "$"+column).join(", ")+");");

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

function handleLemma(lemma) {
    //console.log(lemma);

    // filter empty objects
    if (!Object.keys(lemma).length) {
        return;
    }

    ++processedEntries;

    var binds = {};
    columnList.forEach(column => binds[column] = lemma[column]);
    insertStatementLemma.run(binds);

    if (processedEntries % 1000 === 0) {
        console.log('Processed ' + processedEntries + ' lemmas');
    }
}

function finalizeDb() {
    console.log('Processed ' + processedEntries + ' lemmas');
    console.log('file ended');

    db.exec("COMMIT TRANSACTION;");
    db.close();

    console.log('Copy DB File to App resources...');
    /*fs.copyFile('build/dicziunari.db', 'destination.txt', (err) => {
        if (err) throw err;
        console.log('source.txt was copied to destination.txt');
    });*/

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

function main() {
    console.log('Start converting JSON file...');

    prepareAndCleanDb();

    const pipeline = createPipeline(FILE_PATH);
    configurePipeline(pipeline);
}

main();
