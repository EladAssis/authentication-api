/**
 * Created by asisel01 on 2/3/2016.
 */

var express = require('express');
var app = express();
var fs = require("fs");
var rp = require("request-promise");
var request = require('request');

authenticationObj = [{userName:'elad', password:'123'}];

function checkAuthentication(req, res) {
    var header=req.headers['authorization']||'',        // get the header
        token=header.split(/\s+/).pop()||'',            // and the encoded auth token
        auth=new Buffer(token, 'base64').toString(),    // convert from base64
        parts=auth.split(/:/),                          // split on colon
        username=parts[0],
        password=parts[1];
    for (var i = 0; i < authenticationObj.length; i++)
    {
        if(username == authenticationObj[i].userName && password == authenticationObj[i].password) {
            return true;
        }
    }
    return false;
}

app.get('/', function (req, res) {///
    if (checkAuthentication(req, res)) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var answer = req.originalUrl.split("?");
        getRequest(answer[1], res);
    }
    else
        res.end("you dont have authorization");
});

app.get('/check', function (req, res) {
    res.end("1");
});

function getRequest(query, res)
{
    console.log(query);
    request('http://127.0.0.1:8081/check', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
        res.end(body);

    });
}


var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

});

