/*jshint esnext:true */

var fs = require('fs');
var couchdbBuilder = require('couchdb-builder');
var s = require('underscore.string');
var request = require('request-promise').defaults({
    baseUrl: 'http://localhost:5984/',
    transform: function transform(data) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            console.log(e);
        }
        return data;
    }
});


var path = './exampleDocs/';
var databaseName = 'tnode';

var dir = fs.readdirSync(path);
console.log(dir);
console.log();

var longestNameLength = 0;
dir.forEach(name => {
    if (name.length > longestNameLength) longestNameLength = name.length;
});

var nameCollumnWidth = longestNameLength;

dir.forEach((dir) => {
    if (dir[0] === '_') return;
    var newDoc;
    var docPath = '/' + databaseName + '/_design/' + dir;

    couchdbBuilder.build(path + dir).then((result) => {
        // handle result
        newDoc = {};
        newDoc._id = '_design/' + dir;
        for (var i in result) {
            newDoc[i] = result[i];
        }
        return request(docPath);
    }).then((doc) => {
        var _rev = doc._rev;
        delete doc._rev;
        if (JSON.stringify(doc) === JSON.stringify(newDoc)) {
            console.log(s.rpad(dir, nameCollumnWidth), ' did not change');
        } else {
            console.log(s.rpad(dir, nameCollumnWidth), ' need an update');
            newDoc._rev = _rev;
            return request.put({
                url: docPath,
                body: JSON.stringify(newDoc)
            }).then(() => {
                console.log(s.rpad(dir, nameCollumnWidth), 'updated');
            });
        }
    }, () => {
        console.log(s.rpad(dir, nameCollumnWidth), 'not found');
        return request.put({
            url: docPath,
            body: JSON.stringify(newDoc)
        }).then(() => {
            console.log(s.rpad(dir, nameCollumnWidth), 'uploaded');
        });
    }).catch(err => console.log('catched Error', err));
});