http = require('http');
fs = require('fs');
const config = require('./config');
const EOL = require('os').EOL;

var body = '';

function getActiveWeapon(obj) {
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (obj[prop].state != "holstered") {
                return obj[prop];
            }
        }
    }
}

function teamName(teamcode) {
    var fullteamname;
    if (teamcode == "T") {
        fullteamname = "Terrorist";
        return fullteamname;
    }
    if (teamcode == "CT") {
        fullteamname = "Counter-Terrorist";
        return fullteamname;
    } else {
        fullteamname = "unassigned";
        return fullteamname;
    }
}

/*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    ye olde todo list

    1. actually write this shit to html not just console

    2. support of others than just localplayer
    (is this even possible? ive only tried this with bots so who knows)

    3. make it more 1337

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

server = http.createServer( function(req, res) {
    if (req.method == 'POST') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        req.on('data', function (data) {
            // log payload
            console.log('\033[2J');
            var payload = JSON.parse(data);
            body = data;
            let curWeapon = getActiveWeapon(payload.player.weapons);
            // because we cant trust csgo
            if (curWeapon == null || payload == null) { return; }
            console.log("Game state: " + payload.map.phase + EOL + "Round state: " + payload.round.phase);
            console.log("Active player: " + payload.player.name + " - " + payload.player.activity + " - " + teamName(payload.player.team));
            if (curWeapon.ammo_clip == null) { console.log("Holding: " + curWeapon.name); }
            else { console.log("Holding: " + curWeapon.name + " (" + curWeapon.ammo_clip + "/" + curWeapon.ammo_clip_max + ")"); }
            console.log("Health: " + payload.player.state.health + EOL + "Armour: " + payload.player.state.armor)
        });
        req.on('end', function () {
//            console.log("POST payload: " + body);
        	res.end( '' );
        });
    }
    else
    {
        console.log("pong !");
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        var html = 'weebinfo.js@' + config.host + ':' + config.port + EOL + body;
        res.end(html);
    }
});
 
server.listen(config.port);
console.log('Listening at http://' + config.host + ':' + config.port);