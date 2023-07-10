var rumgrJson = require('./rumgr-json');
var sursilvanJson = require('./sursilvan-json');
var valladerJson = require('./vallader-json');
var puterJson = require('./puter-json');
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
        puterJson.main();
        break;
    
    case "vallader":
        valladerJson.main();
        break;

    case "all":
    default:
        console.log("select valid idiom");
}
