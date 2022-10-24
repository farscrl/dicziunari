var rumgrJson = require('./rumgr-json');
var sursilvanJson = require('./sursilvan-json');
var valladerHtml = require('./vallader-html');
var puterHtml = require('./puter-html');
var surmiranJson = require('./surmiran-json');
var sutsilvanJson = require('./sutsilvan-json');

switch (process.argv[2]) {
    case "rumantschgrischun":
        rumgrJson.main();
        break;

    case "sursilvan":
        sursilvanJson.main();
        break;

    case "sutsilvan":
        sutsilvanJson.main();
        break;

    case "surmiran":
        surmiranJson.main();
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
        sutsilvanJson.main();
        surmiranJson.main();
        puterHtml.main();
        valladerHtml.main();
}
