const fs = require('fs');
const { chain } = require('stream-chain');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const Database = require('better-sqlite3');

const DB_NAME = 'build/dicziunariSQLite.db';

// jsonName is optional; if omitted, colName is used to read from the JSON.
// jsonName supports dot-notation for nested paths (e.g. 'inflection.verb.preschent.sing1').
const columnList = [
    { colName: 'id',                              colType: 'INTEGER PRIMARY KEY' },

    // R
    { colName: 'RStichwort',                      colType: 'TEXT', jsonName: 'rmStichwort' },
    { colName: 'RGenus',                          colType: 'TEXT', jsonName: 'rmGenus' },
    { colName: 'RFlex',                           colType: 'TEXT', jsonName: 'rmFlex' },
    { colName: 'RGrammatik',                      colType: 'TEXT', jsonName: 'rmGrammatik' },
    { colName: 'RSempraez',                       colType: 'TEXT', jsonName: 'rmSubsemantik' },
    { colName: 'RPronunciation',                  colType: 'TEXT', jsonName: 'rmPronunciation' },

    // D
    { colName: 'DStichwort',                      colType: 'TEXT', jsonName: 'deStichwort' },
    { colName: 'DGenus',                          colType: 'TEXT', jsonName: 'deGenus' },
    { colName: 'DFlex',                           colType: 'TEXT', jsonName: 'deFlex' },
    { colName: 'DGrammatik',                      colType: 'TEXT', jsonName: 'deGrammatik' },
    { colName: 'DSempraez',                       colType: 'TEXT', jsonName: 'deSubsemantik' },

    // inflection type (VERB / NOUN / ADJECTIVE)
    { colName: 'inflectiontype',                  colType: 'TEXT', jsonName: 'inflection.inflectionType' },

    // noun
    { colName: 'nounbaseform',                    colType: 'TEXT', jsonName: 'inflection.noun.baseForm' },
    { colName: 'nounmsingular',                   colType: 'TEXT', jsonName: 'inflection.noun.mSingular' },
    { colName: 'nounmplural',                     colType: 'TEXT', jsonName: 'inflection.noun.mPlural' },
    { colName: 'nounfsingular',                   colType: 'TEXT', jsonName: 'inflection.noun.fSingular' },
    { colName: 'nounfplural',                     colType: 'TEXT', jsonName: 'inflection.noun.fPlural' },

    // adjective
    { colName: 'adjectivebaseform',               colType: 'TEXT', jsonName: 'inflection.adjective.baseForm' },
    { colName: 'adjectivemsingular',              colType: 'TEXT', jsonName: 'inflection.adjective.mSingular' },
    { colName: 'adjectivefsingular',              colType: 'TEXT', jsonName: 'inflection.adjective.fSingular' },
    { colName: 'adjectivemplural',                colType: 'TEXT', jsonName: 'inflection.adjective.mPlural' },
    { colName: 'adjectivefplural',                colType: 'TEXT', jsonName: 'inflection.adjective.fPlural' },
    { colName: 'adjectiveadverbialform',          colType: 'TEXT', jsonName: 'inflection.adjective.adverbialForm' },
    { colName: 'adjectivepredicative',            colType: 'TEXT', jsonName: 'inflection.adjective.predicative' },

    // verb
    { colName: 'infinitiv',                       colType: 'TEXT', jsonName: 'inflection.verb.infinitiv' },

    // preschent
    { colName: 'preschentsing1',                  colType: 'TEXT', jsonName: 'inflection.verb.preschent.sing1' },
    { colName: 'preschentsing2',                  colType: 'TEXT', jsonName: 'inflection.verb.preschent.sing2' },
    { colName: 'preschentsing3',                  colType: 'TEXT', jsonName: 'inflection.verb.preschent.sing3' },
    { colName: 'preschentplural1',                colType: 'TEXT', jsonName: 'inflection.verb.preschent.plural1' },
    { colName: 'preschentplural2',                colType: 'TEXT', jsonName: 'inflection.verb.preschent.plural2' },
    { colName: 'preschentplural3',                colType: 'TEXT', jsonName: 'inflection.verb.preschent.plural3' },

    // preschent enclitic
    { colName: 'preschentencliticsing1',          colType: 'TEXT', jsonName: 'inflection.verb.preschentEnclitic.sing1' },
    { colName: 'preschentencliticsing2',          colType: 'TEXT', jsonName: 'inflection.verb.preschentEnclitic.sing2' },
    { colName: 'preschentencliticsing3m',         colType: 'TEXT', jsonName: 'inflection.verb.preschentEnclitic.sing3m' },
    { colName: 'preschentencliticsing3f',         colType: 'TEXT', jsonName: 'inflection.verb.preschentEnclitic.sing3f' },
    { colName: 'preschentencliticplural1',        colType: 'TEXT', jsonName: 'inflection.verb.preschentEnclitic.plural1' },
    { colName: 'preschentencliticplural2',        colType: 'TEXT', jsonName: 'inflection.verb.preschentEnclitic.plural2' },
    { colName: 'preschentencliticplural3',        colType: 'TEXT', jsonName: 'inflection.verb.preschentEnclitic.plural3' },

    // imperfect
    { colName: 'imperfectsing1',                  colType: 'TEXT', jsonName: 'inflection.verb.imperfect.sing1' },
    { colName: 'imperfectsing2',                  colType: 'TEXT', jsonName: 'inflection.verb.imperfect.sing2' },
    { colName: 'imperfectsing3',                  colType: 'TEXT', jsonName: 'inflection.verb.imperfect.sing3' },
    { colName: 'imperfectplural1',                colType: 'TEXT', jsonName: 'inflection.verb.imperfect.plural1' },
    { colName: 'imperfectplural2',                colType: 'TEXT', jsonName: 'inflection.verb.imperfect.plural2' },
    { colName: 'imperfectplural3',                colType: 'TEXT', jsonName: 'inflection.verb.imperfect.plural3' },

    // imperfect enclitic
    { colName: 'imperfectencliticsing1',          colType: 'TEXT', jsonName: 'inflection.verb.imperfectEnclitic.sing1' },
    { colName: 'imperfectencliticsing2',          colType: 'TEXT', jsonName: 'inflection.verb.imperfectEnclitic.sing2' },
    { colName: 'imperfectencliticsing3m',         colType: 'TEXT', jsonName: 'inflection.verb.imperfectEnclitic.sing3m' },
    { colName: 'imperfectencliticsing3f',         colType: 'TEXT', jsonName: 'inflection.verb.imperfectEnclitic.sing3f' },
    { colName: 'imperfectencliticplural1',        colType: 'TEXT', jsonName: 'inflection.verb.imperfectEnclitic.plural1' },
    { colName: 'imperfectencliticplural2',        colType: 'TEXT', jsonName: 'inflection.verb.imperfectEnclitic.plural2' },
    { colName: 'imperfectencliticplural3',        colType: 'TEXT', jsonName: 'inflection.verb.imperfectEnclitic.plural3' },

    // conjunctiv
    { colName: 'conjunctivsing1',                 colType: 'TEXT', jsonName: 'inflection.verb.conjunctiv.sing1' },
    { colName: 'conjunctivsing2',                 colType: 'TEXT', jsonName: 'inflection.verb.conjunctiv.sing2' },
    { colName: 'conjunctivsing3',                 colType: 'TEXT', jsonName: 'inflection.verb.conjunctiv.sing3' },
    { colName: 'conjunctivplural1',               colType: 'TEXT', jsonName: 'inflection.verb.conjunctiv.plural1' },
    { colName: 'conjunctivplural2',               colType: 'TEXT', jsonName: 'inflection.verb.conjunctiv.plural2' },
    { colName: 'conjunctivplural3',               colType: 'TEXT', jsonName: 'inflection.verb.conjunctiv.plural3' },

    // conjunctiv imperfect
    { colName: 'conjunctivimperfectsing1',        colType: 'TEXT', jsonName: 'inflection.verb.conjunctivImperfect.sing1' },
    { colName: 'conjunctivimperfectsing2',        colType: 'TEXT', jsonName: 'inflection.verb.conjunctivImperfect.sing2' },
    { colName: 'conjunctivimperfectsing3',        colType: 'TEXT', jsonName: 'inflection.verb.conjunctivImperfect.sing3' },
    { colName: 'conjunctivimperfectplural1',      colType: 'TEXT', jsonName: 'inflection.verb.conjunctivImperfect.plural1' },
    { colName: 'conjunctivimperfectplural2',      colType: 'TEXT', jsonName: 'inflection.verb.conjunctivImperfect.plural2' },
    { colName: 'conjunctivimperfectplural3',      colType: 'TEXT', jsonName: 'inflection.verb.conjunctivImperfect.plural3' },

    // cundizional (JSON key: cundiziunal)
    { colName: 'cundizionalsing1',                colType: 'TEXT', jsonName: 'inflection.verb.cundiziunal.sing1' },
    { colName: 'cundizionalsing2',                colType: 'TEXT', jsonName: 'inflection.verb.cundiziunal.sing2' },
    { colName: 'cundizionalsing3',                colType: 'TEXT', jsonName: 'inflection.verb.cundiziunal.sing3' },
    { colName: 'cundizionalplural1',              colType: 'TEXT', jsonName: 'inflection.verb.cundiziunal.plural1' },
    { colName: 'cundizionalplural2',              colType: 'TEXT', jsonName: 'inflection.verb.cundiziunal.plural2' },
    { colName: 'cundizionalplural3',              colType: 'TEXT', jsonName: 'inflection.verb.cundiziunal.plural3' },

    // cundizional indirect (JSON key: cundiziunalIndirect; sursilvan, surmiran)
    { colName: 'cundizionalindirectsing1',        colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalIndirect.sing1' },
    { colName: 'cundizionalindirectsing2',        colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalIndirect.sing2' },
    { colName: 'cundizionalindirectsing3',        colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalIndirect.sing3' },
    { colName: 'cundizionalindirectplural1',      colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalIndirect.plural1' },
    { colName: 'cundizionalindirectplural2',      colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalIndirect.plural2' },
    { colName: 'cundizionalindirectplural3',      colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalIndirect.plural3' },

    // cundizional enclitic
    { colName: 'cundizionalencliticsing1',        colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalEnclitic.sing1' },
    { colName: 'cundizionalencliticsing2',        colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalEnclitic.sing2' },
    { colName: 'cundizionalencliticsing3m',       colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalEnclitic.sing3m' },
    { colName: 'cundizionalencliticsing3f',       colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalEnclitic.sing3f' },
    { colName: 'cundizionalencliticplural1',      colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalEnclitic.plural1' },
    { colName: 'cundizionalencliticplural2',      colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalEnclitic.plural2' },
    { colName: 'cundizionalencliticplural3',      colType: 'TEXT', jsonName: 'inflection.verb.cundiziunalEnclitic.plural3' },

    // particip perfect
    { colName: 'participperfectfs',               colType: 'TEXT', jsonName: 'inflection.verb.participPerfect.fs' },
    { colName: 'participperfectms',               colType: 'TEXT', jsonName: 'inflection.verb.participPerfect.ms' },
    { colName: 'participperfectfp',               colType: 'TEXT', jsonName: 'inflection.verb.participPerfect.fp' },
    { colName: 'participperfectmp',               colType: 'TEXT', jsonName: 'inflection.verb.participPerfect.mp' },
    { colName: 'participperfectmspredicativ',      colType: 'TEXT', jsonName: 'inflection.verb.participPerfect.msPredicativ' },

    // futur
    { colName: 'futursing1',                      colType: 'TEXT', jsonName: 'inflection.verb.futur.sing1' },
    { colName: 'futursing2',                      colType: 'TEXT', jsonName: 'inflection.verb.futur.sing2' },
    { colName: 'futursing3',                      colType: 'TEXT', jsonName: 'inflection.verb.futur.sing3' },
    { colName: 'futurplural1',                    colType: 'TEXT', jsonName: 'inflection.verb.futur.plural1' },
    { colName: 'futurplural2',                    colType: 'TEXT', jsonName: 'inflection.verb.futur.plural2' },
    { colName: 'futurplural3',                    colType: 'TEXT', jsonName: 'inflection.verb.futur.plural3' },

    // futur enclitic
    { colName: 'futurencliticsing1',              colType: 'TEXT', jsonName: 'inflection.verb.futurEnclitic.sing1' },
    { colName: 'futurencliticsing2',              colType: 'TEXT', jsonName: 'inflection.verb.futurEnclitic.sing2' },
    { colName: 'futurencliticsing3m',             colType: 'TEXT', jsonName: 'inflection.verb.futurEnclitic.sing3m' },
    { colName: 'futurencliticsing3f',             colType: 'TEXT', jsonName: 'inflection.verb.futurEnclitic.sing3f' },
    { colName: 'futurencliticplural1',            colType: 'TEXT', jsonName: 'inflection.verb.futurEnclitic.plural1' },
    { colName: 'futurencliticplural2',            colType: 'TEXT', jsonName: 'inflection.verb.futurEnclitic.plural2' },
    { colName: 'futurencliticplural3',            colType: 'TEXT', jsonName: 'inflection.verb.futurEnclitic.plural3' },

    // futur dubitativ
    { colName: 'futurdubitativsing1',             colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativ.sing1' },
    { colName: 'futurdubitativsing2',             colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativ.sing2' },
    { colName: 'futurdubitativsing3',             colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativ.sing3' },
    { colName: 'futurdubitativplural1',           colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativ.plural1' },
    { colName: 'futurdubitativplural2',           colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativ.plural2' },
    { colName: 'futurdubitativplural3',           colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativ.plural3' },

    // futur dubitativ enclitic
    { colName: 'futurdubitativencliticsing1',     colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativEnclitic.sing1' },
    { colName: 'futurdubitativencliticsing2',     colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativEnclitic.sing2' },
    { colName: 'futurdubitativencliticsing3m',    colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativEnclitic.sing3m' },
    { colName: 'futurdubitativencliticsing3f',    colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativEnclitic.sing3f' },
    { colName: 'futurdubitativencliticplural1',   colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativEnclitic.plural1' },
    { colName: 'futurdubitativencliticplural2',   colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativEnclitic.plural2' },
    { colName: 'futurdubitativencliticplural3',   colType: 'TEXT', jsonName: 'inflection.verb.futurDubitativEnclitic.plural3' },

    // imperativ
    { colName: 'imperativ1',                      colType: 'TEXT', jsonName: 'inflection.verb.imperativ.singular' },
    { colName: 'imperativ2',                      colType: 'TEXT', jsonName: 'inflection.verb.imperativ.plural' },
    { colName: 'imperativ3',                      colType: 'TEXT', jsonName: 'inflection.verb.imperativ.form3' },
    { colName: 'imperativ4',                      colType: 'TEXT', jsonName: 'inflection.verb.imperativ.form4' },
    { colName: 'imperativ5',                      colType: 'TEXT', jsonName: 'inflection.verb.imperativ.form5' },
    { colName: 'imperativ6',                      colType: 'TEXT', jsonName: 'inflection.verb.imperativ.form6' },

    // gerundium
    { colName: 'gerundium',                       colType: 'TEXT', jsonName: 'inflection.verb.gerundium' },
];

function getNestedValue(obj, path) {
    return path.split('.').reduce((curr, key) => curr && curr[key], obj);
}

function removePronunciationDots(word) {
    if (!word) {
        return word;
    }
    word = word.normalize('NFD');
    const pointBelowDiacriticalMark = "̣";
    word = word.replaceAll(pointBelowDiacriticalMark, "");
    return word.normalize('NFC');
}

// config: { tableName, filePath, displayName, removeDots, preprocessLemma? }
module.exports = {
    main: function (config) {
        const { tableName, filePath, displayName, removeDots, preprocessLemma } = config;

        console.log('Start converting JSON file for ' + displayName + '...');

        let processedEntries = 0;
        let id = 1;

        const db = new Database(DB_NAME);

        //speedup for sqlite inserts
        //as seen on http://blog.quibb.org/2010/08/fast-bulk-inserts-into-sqlite/
        db.pragma("synchronous=OFF");
        db.pragma("count_changes=OFF");
        db.pragma("journal_mode=MEMORY");
        db.pragma("temp_store=MEMORY");

        db.exec("DROP TABLE IF EXISTS " + tableName + ";");

        const columnDef = columnList.map(col => col.colName + ' ' + col.colType).join(", ");
        db.exec("CREATE TABLE " + tableName + "(" + columnDef + ");");
        db.exec("CREATE INDEX " + tableName + "_RStichwort_index ON " + tableName + " (RStichwort COLLATE NOCASE);");
        db.exec("CREATE INDEX " + tableName + "_DStichwort_index ON " + tableName + " (DStichwort COLLATE NOCASE);");

        const insertStatement = db.prepare(
            "INSERT INTO " + tableName + " (" + columnList.map(col => col.colName).join(", ") + ") " +
            "VALUES (" + columnList.map(col => "$" + col.colName).join(", ") + ");"
        );

        db.exec("BEGIN TRANSACTION;");

        const pipeline = chain([
            fs.createReadStream(filePath),
            parser(),
            streamArray(),
            data => data.value
        ]);

        pipeline.on('data', (lemma) => {
            if (!Object.keys(lemma).length) {
                return;
            }

            if (preprocessLemma) {
                preprocessLemma(lemma);
            }

            var binds = { id };
            const transform = removeDots ? removePronunciationDots : (v => v);
            columnList.forEach(col => {
                const jsonPath = col.jsonName || col.colName;
                const value = jsonPath.includes('.') ? getNestedValue(lemma, jsonPath) : lemma[jsonPath];
                binds[col.colName] = transform(value);
            });
            insertStatement.run(binds);

            id++;
            ++processedEntries;
            if (processedEntries % 1000 === 0) {
                console.log('Processed ' + processedEntries + ' lemmas');
            }
        });

        pipeline.on('end', () => {
            console.log('Processed ' + processedEntries + ' lemmas');
            console.log('file ended');
            db.exec("COMMIT TRANSACTION;");
            db.close();
            console.log('Conversion ended');
        });
    }
};
