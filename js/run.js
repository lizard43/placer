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

    tinysort('#' + team + '>div', { attr: 'data-place' });

    var score = 0;
    $('#' + team).children('div').each(function () {
        score += $(this).data('place');
    });
    $('#' + team + 'score').text(score);
}

function showSettings() {

    $('.settingsTeams').empty();

    teams.forEach(team => {

        var teamNode = $("<div></div>").attr('id', 'settingsteam-' + team).attr('class', 'middle');

        var plusIcon = $("<img src='images/minus.png'></img>");
        teamNode.append(plusIcon);

        var teamName = $("<input type='text' class='' />").val(team)
            .attr('class', 'teamName');
        teamNode.append(teamName);

        var colorPicker = $("<input/>")
            .attr('type', 'text')
            .attr('id', 'settingscolor-' + team)
            .attr('class', 'colorPicker');
        teamNode.append(colorPicker);

        $('.settingsTeams').append(teamNode);
    });

    $('.colorPicker').spectrum({
        color: "#ECC",
        showInput: true,
        className: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        maxSelectionSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        move: function (color) {

        },
        show: function () {

        },
        beforeShow: function () {

        },
        hide: function () {

        },
        change: function () {

        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ]
    });


    document.getElementById("settings").style.display = "block";
}

function closeSettings() {
    document.getElementById("settings").style.display = "none";
}

function saveSettings() {

    document.getElementById("settings").style.display = "none";
}

class Team {
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }
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
