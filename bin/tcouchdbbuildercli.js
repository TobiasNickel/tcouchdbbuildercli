var path = require('path');
var fs = require('fs');

//optjs
var args = (function opt() {
    var opt = {}, arg, p, argv = Array.prototype.slice.call(process.argv); for (var i = 2; i < argv.length; i++)if (argv[i].charAt(0) == '-')
        ((p = (arg = ("" + argv.splice(i--, 1)).replace(/^[\-]+/, '')).indexOf("=")) > 0 ? opt[arg.substring(0, p)] = arg.substring(p + 1) : opt[arg] = true);
    return { 'node': argv[0], 'script': argv[1], 'argv': argv.slice(2), 'opt': opt };
})();

//console.log(args);

var dirPath = args.argv[args.argv.length - 1] || "";
var absolutePath = path.resolve(process.cwd(), dirPath);

if (args.opt.h || args.opt.help) {
    console.log('usage: tcouchdbbuildercli [options] root');
    console.log('params:');
    console.log('-h, -help              show this help');
    console.log('-host=server           server to connect (localhost)');
    console.log('-port=number           the port to connect (5984)');
    console.log('-protocol=protocol     http or https (http)');
    console.log('-connection=connection host port and protocol together');
    console.log('-dbname=name           name of the db (tcouchdbbuilderclidb)');
    console.log('-task=task             update, read or test');
    console.log('-document=docName      the document to process');
    console.log('-generalsDoc=name      document containing defaults (not yet inplemented)');
    
    return;
}

// load config
if(absolutePath.indexOf('.json')===absolutePath.length-5){
    try {
        var config = JSON.parse(fs.readFileSync(absolutePath)+'');
        // to embedd it to package.json
        if(config.tcouchdbbuilderconfig){
            config = config.tcouchdbbuilderconfig;
        }
        absolutePath = path.resolve(absolutePath, config.directory);
        //extend options
        for(var i in config){
            args.opt[i] = config[i];
        }
    } catch (err) {
        console.log('could not load config from: ' + absolutePath);
        console.log(err);
        return;
    }
}


var host = args.opt.host || 'localhost';
var port = args.opt.port || '5984';
var protocol = args.opt.protocol || 'http';
var connection = args.opt.connection || (protocol + "://" + host + ':' + port);
var databaseName = args.opt.dbname || args.opt.databaseName || 'tcouchdbbuilderclidb';
var db = args.opt.db || connection + '/' + databaseName;
var task = args.opt.task || "update";
var documentName = args.opt.document || undefined;


var request = require('request-promise');

request.get(connection+'/'+databaseName).then(function(data){
    if(task==='update'){
        var update = require('../lib/update');
        update(connection, databaseName, absolutePath, documentName);
    }
}).catch(function(err){
    if((err.error+"").indexOf('no_db_file')!==-1){
        console.log('database "'+databaseName+'" not found at '+connection);
        return;
    }
    console.log(err)
});
