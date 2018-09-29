var express = require('express'); 
var fs = require('fs');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const { join } = require('path');

app.use(express.static(__dirname));
app.use(bodyParser({'limit':'50mb'}));
app.use(function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

var server = app.listen(1234, function () {
    var host = server
        .address()
        .address;
    var port = server
        .address()
        .port;

    console.log('listening at http://%s:%s', host, port);
});

app.post('/upload', function (req, res) {
    var base64Data = req.body['image'].replace(/^data:image\/png;base64,/,"");
    var label = req.body['label'];
    var fileName = req.body['fileName'];
    console.log(label);
    var directory = "/Users/Jerry/Desktop/data/" + label;
    fs.stat(directory, function(err, stats) {
        if (err && err.errno == 34) {
            // directory does not exist, create it
            fs.mkdir(directory, function(err) {
                if (err) {
                    console.log(err);
                    res.json({message: 'error'});
                } else {
                    fs.writeFile(directory + "/" + fileName, base64Data, 'base64', function (err) {
                        if (err) throw err;
                        res.json({message: 'success'});
                    });
                }
            });
        } else {
            fs.writeFile(directory + "/" + fileName, base64Data, 'base64', function (err) {
                if (err) throw err;
                res.json({message: 'success'});
            });
        }
    });
});

const isDirectory = source => fs.lstatSync(source).isDirectory()
const getDirectories = source =>
  fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)
app.post('/delete', function(req, res) {
    const dirs = getDirectories("/Users/Jerry/Desktop/data/")
    for (const dir of dirs) {
        fs.readdir(dir, (err, files) => {
            if (err) throw err;
            for (const file of files){
                fs.unlink(join(dir, file), err => {
                    if (err) throw err;
                });
                console.log(join(dir, file));
            }
        });
    }
})

// var async = require('async');
// app.get('/images', function(req, res) {
//     const dirs = getDirectories("/Users/Jerry/Desktop/data/")
//     async.forEachOf(dirs, (dir, callback) => {
//         dirs
//     })
// })
