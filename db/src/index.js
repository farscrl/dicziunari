var rumgrJson = require('./rumgr-json');
var sursilvanJson = require('./sursilvan-json');
var valladerHtml = require('./vallader-html');
var puterHtml = require('./puter-html');
var surmiranXml = require('./surmiran-xml');
var sutsilvanXml = require('./sutsilvan-xml');

switch (process.argv[2]) {
    case "rumantschgrischun":
        rumgrJson.main();
        break;

    case "sursilvan":
        sursilvanJson.main();
        break;

    case "sutsilvan":
        sutsilvanXml.main();
        break;

    case "surmiran":
        surmiranXml.main();
        break;
    
    case "puter":
        puterHtml.main();
        break;
    
    case "vallader":
        valladerHtml.main();
        break;

    case "all":
    default:
        rumgrJson.main();
        sursilvanJson.main();
        sutsilvanXml.main();
        surmiranXml.main();
        puterHtml.main();
        valladerHtml.main();
}
