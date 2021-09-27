var rumgrJson = require('./rumgr-json');


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
        console.log("Not implemented yet");
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
