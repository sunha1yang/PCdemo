var http = require("http");
var fs = require("fs");
var url = require("url");
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url),
        pathname = urlObj.pathname,
        query = urlObj.query;
    var reg = /\.(HTML|CSS|JS|ICO|JPG|PNG|GIF)/i;
    if (reg.test(pathname)) {
        try {
            var sum = reg.exec(pathname)[1].toUpperCase();
            var fm = null;
            switch (sum) {
                case "HTML":
                    fm = "text/html";
                    break;
                case "CSS":
                    fm = "text/css";
                    break;
                case "JS":
                    fm = "text/javascript";
                    break;
                case "JPG":
                    fm = "image/jpeg";
                    break;
                case "PNG":
                    fm = "image/png";
                    break;
                case "GIF":
                    fm = "image/gif";
                    break;
            }
            if (/\.(JPG|PNG|GIF)/i.test(pathname)) {
                var conFile = fs.readFileSync("." + pathname);
            } else {
                var conFile = fs.readFileSync("." + pathname, "utf8");
            }
            res.writeHead(200, {"context-type": fm + ";charset:utf-8"});
            res.end(conFile)
        } catch (e) {
            res.writeHead(404, {"context-type": "text/plain;charset:utf-8"});
            res.end("你特么写错了，别特么瞎写");
        }
        return;
    }

    var path = "./nodeModule/customInfo.json";

    if (pathname == "/add") {
        var addTemp = "";
        req.addListener("data", function (postCon) {
            addTemp += postCon;
        });
        req.addListener('end', function () {
            var con = fs.readFileSync(path, "utf8");
            addTemp = JSON.parse(addTemp);
            if (!con) {
                con = [];
                con.push(addTemp);
                fs.writeFileSync(path, JSON.stringify(con));
                res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
                res.end(JSON.stringify({
                    "code": 0,
                    "message": "创建成功!"
                }));
                return;
            }
            con = JSON.parse(con);

            for (var i = 0; i < con.length; i++) {
                var cur = con[i];
                if (addTemp["phone"] == cur["phone"]) {
                    res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
                    res.end(JSON.stringify({
                        "code": 1,
                        "message": "用户名已存在，请重新注册!"
                    }));
                    return
                }
            }
            con.push(addTemp);
            fs.writeFileSync(path, JSON.stringify(con));
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify({
                "code": 0,
                "message": "创建成功!"
            }));
        });
        return;
    }

    if (pathname == "/loading") {
        var loadTemp = "";
        req.addListener("data", function (postCon) {
            loadTemp += postCon;
        });
        req.addListener("end", function () {
            loadTemp = JSON.parse(loadTemp);
            var obj = null;
            var con = fs.readFileSync(path, "utf8");
            if (!con) {
                obj = {
                    "code": 1,
                    "message": "请注册"
                };
                res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
                res.end(JSON.stringify(obj));
                return;
            }
            con = JSON.parse(con);
            for (var i = 0; i < con.length; i++) {
                var cur = con[i];
                var bok = true;
                for (var key in cur) {
                    var reg = new RegExp('(^| +)' + cur[key] + '( +|$)');
                    if (!reg.test(loadTemp[key])) {
                        bok = false;
                    }
                }
            }
            if (bok) {
                obj = {
                    "code": 0,
                    "message": "登录成功"
                }
            } else {
                obj = {
                    "code": 1,
                    "message": "请注册"
                }
            }
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify(obj));
        });
        return;
    }


});
server.listen(998, function () {
    console.log("创建成功")
});
