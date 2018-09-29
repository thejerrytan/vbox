var express = require('express'); 
var fs = require('fs');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const { join } = require('path');


const DATADIR = "/Users/horensen/Desktop/data/";

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
    console.log(base64Data.substring[0,20]);
    var label = req.body['label'];
    var fileName = req.body['fileName'];
    console.log(label);
    var directory = DATADIR + label;
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
    const dirs = getDirectories(DATADIR)
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

var async = require('async');
app.get('/imagesFromStorage', function(req, res) {
    const dirs = getDirectories(DATADIR);
    var result = {};
    async.each(dirs, (dir, callback) => {
        console.log(dir);
        result[dir] = [];
        fs.readdir(dir, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                result[dir].push(file);
            }
            callback();
        });
    }, err => {
        if (err) {
            console.error(err.message);
            return res.json({
                "message": "failure",
                "files": result
            });
        }
        console.log("SUCCESSFUL retrieved all files");
        console.log(result);
        return res.json({
            "message": "success",
            "files": result
        });
    });
});

app.get('/image/:label/:filename', function(req, res) {
    console.log(req.params);
    fs.readFile(DATADIR + "/" + req.params.label + "/" + req.params.filename, function(err, data) {
        if (!err) {
            // console.log(data);
            var img = new Buffer(data, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
        } else {
            res.status(404).json({"message": "failure"});
        }
        
    });
})
