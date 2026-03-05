const convert = require('./convert-json');

const configs = {
    rumantschgrischun: {
        tableName: 'rumgr',
        filePath: 'data/pledarigrond_export_json_rumantschgrischun.json',
        displayName: 'Rumantsch Grischun',
        removeDots: false,
    },
    sursilvan: {
        tableName: 'sursilvan',
        filePath: 'data/pledarigrond_export_json_sursilvan.json',
        displayName: 'Sursilvan',
        removeDots: false,
    },
    sutsilvan: {
        tableName: 'sutsilvan',
        filePath: 'data/pledarigrond_export_json_sutsilvan.json',
        displayName: 'Sutsilvan',
        removeDots: false,
    },
    surmiran: {
        tableName: 'surmiran',
        filePath: 'data/pledarigrond_export_json_surmiran.json',
        displayName: 'Surmiran',
        removeDots: false,
    },
    puter: {
        tableName: 'puter',
        filePath: 'data/pledarigrond_export_json_puter.json',
        displayName: 'Puter',
        removeDots: true,
    },
    vallader: {
        tableName: 'vallader',
        filePath: 'data/pledarigrond_export_json_vallader.json',
        displayName: 'Vallader',
        removeDots: true,
        preprocessLemma: (lemma) => {
            const preschent = lemma?.inflection?.verb?.preschent;
            if (preschent?.plural2) {
                preschent.plural2 = preschent.plural2.replace(/\((vo \w+)\)/i, '$1');
            }
        },
    },
};

const idiom = process.argv[2];
const config = configs[idiom];

if (!config) {
    console.log("select valid idiom: " + Object.keys(configs).join(', '));
    process.exit(1);
}

convert.main(config);