const fs = require('fs');
const Database = require('better-sqlite3');
const XmlStream = require('xml-stream');

const DB_NAME = 'build/dicziunariSQLite.db';
const TABLE_SUTSILVAN = 'sutsilvan';
// const TABLE_SUTSILVAN_IDX = 'sutsilvan_idx';
const FILE_PATH = 'data/maalr_db_dump_all_versions_3_sutsilvan.xml';
// const FILE_PATH = 'data/maalr_db_dump_all_versions_3_sutsilvan_short.xml';

let processedEntries = 0;
const columnList = [
    { colName: 'id',                 colType: 'INTEGER PRIMARY KEY' },

    // R
    { colName: 'RStichwort',         colType: 'TEXT' },
    { colName: 'RGenus',             colType: 'TEXT' },
    { colName: 'RSemantik',          colType: 'TEXT' },

    // D
    { colName: 'DStichwort',         colType: 'TEXT' },
    { colName: 'DGenus',             colType: 'TEXT' },
    { colName: 'DSemantik',          colType: 'TEXT' },

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

    db.exec("DROP TABLE IF EXISTS " + TABLE_SUTSILVAN +" ;");
    // db.exec("DROP TABLE IF EXISTS " + TABLE_SUTSILVAN_IDX + ";")

    // create used columns
    const columnDef = columnList.map(column => column.colName + ' ' + column.colType).join(", ");
    db.exec("CREATE TABLE " + TABLE_SUTSILVAN + "(" +columnDef + ");");

    // creating virtual fts5 table. Used options:
    // lemma is the search term. content sets the content to another table, content_rowid defines what column that identifies the data in the data-table, columsize defines, that values are not stored seperately in the virtual table
    // db.exec("CREATE VIRTUAL TABLE " + TABLE_SUTSILVAN_IDX + " using fts5(lemma, content = '" + TABLE_SUTSILVAN + "', content_rowid = 'id', columnsize=0);");

    // create prepared statement to add each lemma
    insertStatementLemma = db.prepare(
        "INSERT INTO " + TABLE_SUTSILVAN + " ("+ columnList.map(col => col.colName).join(", ")+") " + 
        "VALUES (" + Array.from(columnList).map(column => "$"+column.colName).join(", ")+");");
    // insertStatementIdx = db.prepare("INSERT INTO " + TABLE_SUTSILVAN_IDX + " (rowId, lemma) VALUES ($rowId, $lemma);");
    
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
    const data = fs.createReadStream(FILE_PATH, 'utf8');

    let processedEntries = 0;

    var xml = new XmlStream(data);

    xml.collect('version');
    xml.collect('entry');

    xml.on('endElement: versions', function(item) {
        var lemma = {};
        lemma['id'] = processedEntries;

        item["version"].forEach(version => {
            if (version["$"]["verification"] != 'ACCEPTED') {
                return;
            }
            
            version.fields.entry.forEach(entry => {
                switch (entry["key"]) {
                    case "DStichwort":
                        lemma["DStichwort"] = entry["value"];
                        break;
                    case "RStichwort":
                        lemma["RStichwort"] = entry["value"];
                        break;
                    case "DGrammatik":
                        lemma["DGrammatik"] = entry["value"];
                        break;
                    case "RGrammatik":
                        lemma["RGrammatik"] = entry["value"];
                        break;
                    case "DSubsemantik":
                        lemma["DSubsemantik"] = entry["value"];
                        break;
                    case "RSubsemantik":
                        lemma["RSubsemantik"] = entry["value"];
                        break;
                    case "RGenus":
                        lemma["RGenus"] = entry["value"];
                        break;
                    case "DGenus":
                        lemma["DGenus"] = entry["value"];
                        break;
                    case "RFlex":
                        lemma["RFlex"] = entry["value"];
                        break;
                    case "DFlex":
                        lemma["DFlex"] = entry["value"];
                        break;
                    case "RSemantik":
                        lemma["RSemantik"] = entry["value"];
                        break;
                    case "DSemantik":
                        lemma["DSemantik"] = entry["value"];
                        break;

                    case "preschentsing1":
                        lemma["preschentsing1"] = entry["value"];
                        break;
                    case "preschentsing2":
                        lemma["preschentsing2"] = entry["value"];
                        break;
                    case "preschentsing3":
                        lemma["preschentsing3"] = entry["value"];
                        break;
                    case "preschentplural1":
                        lemma["preschentplural1"] = entry["value"];
                        break;
                    case "preschentplural2":
                        lemma["preschentplural2"] = entry["value"];
                        break;
                    case "preschentplural3":
                        lemma["preschentplural3"] = entry["value"];
                        break;

                    case "imperfectsing1":
                        lemma["imperfectsing1"] = entry["value"];
                        break;
                    case "imperfectsing2":
                        lemma["imperfectsing2"] = entry["value"];
                        break;
                    case "imperfectsing3":
                        lemma["imperfectsing3"] = entry["value"];
                        break;
                    case "imperfectplural1":
                        lemma["imperfectplural1"] = entry["value"];
                        break;
                    case "imperfectplural2":
                        lemma["imperfectplural2"] = entry["value"];
                        break;
                    case "imperfectplural3":
                        lemma["imperfectplural3"] = entry["value"];
                        break;

                    case "futursing1":
                        lemma["futursing1"] = entry["value"];
                        break;
                    case "futursing2":
                        lemma["futursing2"] = entry["value"];
                        break;
                    case "futursing3":
                        lemma["futursing3"] = entry["value"];
                        break;
                    case "futurplural1":
                        lemma["futurplural1"] = entry["value"];
                        break;
                    case "futurplural2":
                        lemma["futurplural2"] = entry["value"];
                        break;
                    case "futurplural3":
                        lemma["futurplural3"] = entry["value"];
                        break;

                    case "cundizionalsing1":
                        lemma["cundizionalsing1"] = entry["value"];
                        break;
                    case "cundizionalsing2":
                        lemma["cundizionalsing2"] = entry["value"];
                        break;
                    case "cundizionalsing3":
                        lemma["cundizionalsing3"] = entry["value"];
                        break;
                    case "cundizionalplural1":
                        lemma["cundizionalplural1"] = entry["value"];
                        break;
                    case "cundizionalplural2":
                        lemma["cundizionalplural2"] = entry["value"];
                        break;
                    case "cundizionalplural3":
                        lemma["cundizionalplural3"] = entry["value"];
                        break;

                    case "conjunctivsing1":
                        lemma["conjunctivsing1"] = entry["value"];
                        break;
                    case "conjunctivsing2":
                        lemma["conjunctivsing2"] = entry["value"];
                        break;
                    case "conjunctivsing3":
                        lemma["conjunctivsing3"] = entry["value"];
                        break;
                    case "conjunctivplural1":
                        lemma["conjunctivplural1"] = entry["value"];
                        break;
                    case "conjunctivplural2":
                        lemma["conjunctivplural2"] = entry["value"];
                        break;
                    case "conjunctivplural3":
                        lemma["conjunctivplural3"] = entry["value"];
                        break;

                    case "participperfectfs":
                        lemma["participperfectfs"] = entry["value"];
                        break;
                    case "participperfectfp":
                        lemma["participperfectfp"] = entry["value"];
                        break;
                    case "participperfectmp":
                        lemma["participperfectmp"] = entry["value"];
                        break;
                    case "participperfectms":
                        lemma["participperfectms"] = entry["value"];
                        break;

                    case "imperativ1":
                        lemma["imperativ1"] = entry["value"];
                        break;
                    case "imperativ2":
                        lemma["imperativ2"] = entry["value"];
                        break;
                    
                    case "gerundium":
                        lemma["gerundium"] = entry["value"];
                        break;

                    case "DStichwort_sort":
                    case "RStichwort_sort":
                    case "RStatus":
                    case "DStatus":
                    case "RecID":
                    case "DSemind":
                    case "RSemind":
                    case "redirect_b":
                    case "maalr_overlay_lang2":
                    case "maalr_overlay_lang1":
                    case "maalr_email":
                    case "maalr_comment":
                    case "redirect_a":
                    case "DTags":
                    case "RTags":
                    case "_id":
                        // ignore fields
                        break;
                    default:
                        console.log("unknown key: ", entry["key"]);
                        
                }
            });

            insertLemma(lemma);
            processedEntries++;
            if (processedEntries % 100 === 0) {
                console.log('Processed ' + processedEntries + ' lemmas');
            }
        });
    });

    xml.on('end', function(item) {
        finalizeDb();
    });
}

module.exports = {
    main: function () {
        console.log('Start converting XML file for Sutsilvan...');
        prepareAndCleanDb();
        parseData();
        
    }
}
