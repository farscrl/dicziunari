var rumgrJson = require('./rumgr-json');
var sursilvanJson = require('./sursilvan-json');
var valladerHtml = require('./vallader-html');
var puterHtml = require('./puter-html');
var surmiranXml = require('./surmiran-xml');


switch (process.argv[2]) {
    case "rumantschgrischun":
        rumgrJson.main();
        break;

    case "sursilvan":
        sursilvanJson.main();
        break;

    case "sutsilvan":
        console.log("Not implemented yet");
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
        // todo: sutsilvan
        surmiranXml.main();
        puterHtml.main();
        valladerHtml.main();
}
