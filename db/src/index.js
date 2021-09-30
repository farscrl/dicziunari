var rumgrJson = require('./rumgr-json');
var valladerHtml = require('./vallader-html');


switch (process.argv[2]) {
    case "rumantschgrischun":
        rumgrJson.main();
        break;

    case "sursilvan":
        console.log("Not implemented yet");
        break;

    case "sutsilvan":
        console.log("Not implemented yet");
        break;

    case "surmiran":
        console.log("Not implemented yet");
        break;
    
    case "puter":
        console.log("Not implemented yet");
        break;
    
    case "vallader":
        valladerHtml.main();
        break;

    case "all":
    default:
        rumgrJson.main();
        // todo: sursilvan
        // todo: sutsilvan
        // todo: surmiran
        // todo: puter
        // todo: vallader
}
