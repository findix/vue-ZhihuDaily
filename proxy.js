var http = require('http');
var url = require('url');
var fs = require("fs");
var path = require("path");

var caches = {};

var server = http.createServer(function(req, res) {
    var result = url.parse(req.url);
    if (result.pathname.match(/\/static/) !== null ||
        result.pathname === '/') {
        console.log('static: ' + req.url);
        var pathname = result.pathname;
        if (result.pathname.endsWith('/')) {
            pathname += 'index.html';
        }
        var realPath = path.join(".", path.normalize(pathname.replace(/\.\./g, "")));
        console.log(realPath);
        fs.stat(realPath, function(err, stat) {
            if (err === null) {
                if (stat.isDirectory()) {
                    realPath = path.join(realPath, "/", 'index.html');
                }
                fs.readFile(realPath, "binary", function(err, file) {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(err);
                    } else {
                        var ext = path.extname(realPath);
                        ext = ext ? ext.slice(1) : 'unknown';
                        var contentType = mime[ext] || "text/plain";
                        res.writeHead(200, {
                            'Content-Type': contentType
                        });
                        res.write(file, "binary");
                        res.end();
                    }
                });
            } else if (err.code == 'ENOENT') {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.write("This request URL " + pathname + " was not found on this server.");
                res.end();
            } else {
                console.log('错误：' + err);
            }
        });
    } else if (result.pathname.match(/\/api\/4/)) {
        result.protocol = 'http:';
        result.slashes = false;
        result.port = 80;
        result.hostname = 'news-at.zhihu.com';

        var cache = caches[url.format(result)];
        if (cache) {
            console.log('passby(use cache): ' + req.url);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', 'text/json; charset=utf-8');
            res.end(cache);
        } else {
            http.get(url.format(result), function(response) {
                var source = "";
                //通过 get 请求获取网页代码 source
                response.on('data', function(data) {
                    source += data;
                });
                //获取到数据 source，我们可以对数据进行操作了!
                response.on('end', function() {
                    console.log('passby: ' + req.url);
                    caches[url.format(result)] = source;
                    for(var k in response.headers){
                        res.setHeader(k,response.headers[k]);
                    }
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    // res.setHeader('Content-Type', 'text/json; charset=utf-8');
                    res.end(source);
                });
            }).on('error', function() {
                res.end("ERROR");
            });
        }
    }
});

var port = 9090;
server.listen(port);
console.log("Server is listening on " + port);

var mime = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};


// var exec = require('child_process').exec;
// var cmdStr = 'npm run dev';
// exec(cmdStr, function(err, stdout, stderr) {
//     if (err) {
//         console.log('error: ' + stderr);
//     } else {
//         console.log(stdout);
//     }
// });
