var base = 60;

var clocktimer, dateObj, dh, dm, ds, ms;
var readout = '';
var h = 1;
var m = 1;
var tm = 1;
var s = 0;
var ts = 0;
var ms = 0;
var running = 0;
var place = 1;

var teams = ["team1", "team2", "team3", "team4", "team5", "team6", "team7", "team8", "team9", "team10", "team11"];

function startTIME() {

    var cdateObj = new Date();
    var t = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);

    if (t > 999) {
        s++;
    }

    if (s >= (m * base)) {
        ts = 0;
        m++;
    } else {
        ts = parseInt((ms / 100) + s);
        if (ts >= base) {
            ts = ts - ((m - 1) * base);
        }
    }

    if (m > (h * base)) {
        tm = 1;
        h++;
    } else {
        tm = parseInt((ms / 100) + m);
        if (tm >= base) {
            tm = tm - ((h - 1) * base);
        }
    }

    ms = Math.round(t / 10);
    if (ms > 99) {
        ms = 0;
    }
    if (ms == 0) {
        ms = '00';
    }
    if (ms > 0 && ms <= 9) {
        ms = '0' + ms;
    }

    if (ts > 0) {
        ds = ts;
        if (ts < 10) {
            ds = '0' + ts;
        }
    } else {
        ds = '00';
    }
    dm = tm - 1;
    if (dm > 0) {
        if (dm < 10) {
            dm = '0' + dm;
        }
    } else {
        dm = '00';
    }
    dh = h - 1;
    if (dh > 0) {
        if (dh < 10) {
            dh = '0' + dh + ':';
        }
    } else {
        dh = '';
    }

    readout = dh + dm + ':' + ds + '.' + ms;

    document.clockform.clock.value = readout;
    clocktimer = setTimeout("startTIME()", 1);
}

function findTIME() {
    if (running === 0) {
        $("#starter").text('Stop');
        running = 1;
        dateObj = new Date();
        startTIME();
    } else {
        $("#starter").text('Start');
        running = 0;
        clearTimeout(clocktimer);
    }
}

function clearALL() {
    clearTimeout(clocktimer);
    h = 1; m = 1; tm = 1; s = 0; ts = 0; ms = 0;
    running = 0; show = true;
    readout = '00:00.00';
    document.clockform.clock.value = readout;
    place = 1;

    $("#starter").text('Start');

    for (var team in teams) {
        $('#' + teams[team]).empty();
        $('#' + teams[team] + 'score').text('0');
    }
}

function swipeRightHandler(event) {
    var current = event.currentTarget.parentNode.id;
    var right = getRight(current);
    $(event.target).detach().appendTo('#' + right);
    updateScore(current);
    updateScore(right);
}

function swipeLeftHandler(event) {
    var current = event.currentTarget.parentNode.id;
    var left = getLeft(current);
    $(event.target).detach().appendTo('#' + left);
    updateScore(current);
    updateScore(left);
}

function getRight(team) {
    var index = teams.indexOf(team) + 1;
    if (index > (teams.length - 1)) {
        index = 0;
    }
    return teams[index];
}

function getLeft(team) {
    var index = teams.indexOf(team) - 1;
    if (index < 0) {
        index = (teams.length - 1);
    }
    return teams[index];
}

function addTime(team) {
    if (running > 0) {
        var p = $('<div/>', {
            class: 'placer'
        });
        p.on("swiperight", swipeRightHandler);
        p.on("swipeleft", swipeLeftHandler);
        p.html(place + '<br>' + readout);
        p.data("place", place);
        //alert(p.data("place"));
        p.attr("data-place", place);
        $('#' + team).append(p);
        place++;
    }
    updateScore(team);
}

function updateScore(team) {

    tinysort('#'+team+'>div',{attr:'data-place'});

    var score = 0;
    $('#' + team).children('div').each(function () {
        score += $(this).data('place');
    });
    $('#' + team + 'score').text(score);
}

$(function () {
    $("#team1button").click(function () { addTime('team1'); });
    $("#team2button").click(function () { addTime('team2'); });
    $("#team3button").click(function () { addTime('team3'); });
    $("#team4button").click(function () { addTime('team4'); });
    $("#team5button").click(function () { addTime('team5'); });
    $("#team6button").click(function () { addTime('team6'); });
    $("#team7button").click(function () { addTime('team7'); });
    $("#team8button").click(function () { addTime('team8'); });
    $("#team9button").click(function () { addTime('team9'); });
    $("#team10button").click(function () { addTime('team10'); });
    $("#team11button").click(function () { addTime('team11'); });
});
