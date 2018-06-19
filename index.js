var express = require('express'),
app = express(),
server = require('http').createServer(app);

server.listen(3000);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({server: server});

// ´æ´¢socketµÄÊý×é£¬ÕâÀïÖ»ÄÜÓÐ2¸ösocket£¬Ã¿´Î²âÊÔÐèÒªÖØÆô£¬·ñÔò»á³ö´í
var wsc = [],
index = 1;

// ÓÐsocketÁ¬Èë
wss.on('connection', function(ws) {
    console.log('connection');

    // ½«socket´æÈëÊý×é
    wsc.push(ws);

    // ¼ÇÏÂ¶Ô·½socketÔÚÊý×éÖÐµÄÏÂ±ê£¬ÒòÎªÕâ¸ö²âÊÔ³ÌÐòÖ»ÔÊÐí2¸ösocket
    // ËùÒÔµÚÒ»¸öÁ¬ÈëµÄsocket´æÈë0£¬µÚ¶þ¸öÁ¬ÈëµÄ¾ÍÊÇ´æÈë1
    // otherIndex¾Í·´×ÅÀ´£¬µÚÒ»¸ösocketµÄotherIndexÏÂ±êÎª1£¬µÚ¶þ¸ösocketµÄotherIndexÏÂ±êÎª0
    var otherIndex = index--,
    desc = null;

    if (otherIndex == 1) {
        desc = 'first socket';
    } else {
        desc = 'second socket';
    }

    // ×ª·¢ÊÕµ½µÄÏûÏ¢
    ws.on('message', function(message) {
        var json = JSON.parse(message);
        console.log('received (' + desc + '): ', json);

        wsc[otherIndex].send(message, function (error) {
            if (error) {
                console.log('Send message error (' + desc + '): ', error);
            }
        });
    });
});