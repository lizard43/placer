//
// https://lizard43.com
//

// clock stuff

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

// the main object, this array holds Team objects which
// is used to score table
var teams = [];

// starts the Timer
//
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

// Start or Stops timer
//
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

// Clears times, scores and places
//
function clearALL() {
    clearTimeout(clocktimer);
    h = 1; m = 1; tm = 1; s = 0; ts = 0; ms = 0;
    running = 0; show = true;
    readout = '00:00.00';
    document.clockform.clock.value = readout;
    place = 1;

    $("#starter").text('Start');

    buildScoreTable();
}

// moves a place to the team to the RIGHT and updates scores
//
function swipeRightHandler(event) {
    var current = event.currentTarget.parentNode.id;
    var right = getRight(current);
    $(event.target).detach().appendTo('#' + right);
    updateScore(current);
    updateScore(right);
}

// moves a place to the team to the LEFT and updates scores
//
function swipeLeftHandler(event) {
    var current = event.currentTarget.parentNode.id;
    var left = getLeft(current);
    $(event.target).detach().appendTo('#' + left);
    updateScore(current);
    updateScore(left);
}

// Gets the team to the RIGHT
//
function getRight(team) {
    var index = teams.findIndex(function(t) { return (t.name === team) }) + 1;
    if (index > (teams.length - 1)) {
        index = 0;
    }
    return teams[index].name;
}

// Gets the team to the LEFT
//
function getLeft(team) {
    var index = teams.findIndex(function(t) { return ( t.name === team) }) - 1;
    if (index < 0) {
        index = (teams.length - 1);
    }
    return teams[index].name;
}

// Adds a place to the selected team
//
function addTime(team) {
    if (running > 0) {
        var p = $('<div/>', {
            class: 'placer'
        });
        p.on("swiperight", swipeRightHandler);
        p.on("swipeleft", swipeLeftHandler);
        p.html(place + '<br>' + readout);
        p.data("place", place);
        p.attr("data-place", place);
        $('#' + team).append(p);
        place++;
    }
    updateScore(team);
}

// Sorts the places and calculates the team's score
//
function updateScore(team) {

    tinysort('#' + team + '>div', { attr: 'data-place' });

    var score = 0;
    $('#' + team).children('div').each(function () {
        score += $(this).data('place');
    });
    $('#' + team + 'score').text(score);
}

// Shows the settings screen.
// Builds selections to change team name and color
//
function showSettings() {

    $('.settingsTeams').empty();

    teams = getTeamCookie();

    teams.forEach(function(team) {

        var name = team.name;

        addTeam(name)
    });

    // create color pickers
    teams.forEach(function(team) {
        spectrumIt('#settingscolor-' + team.name, team.color);
    });

    // make visible
    $('#settingsScreen').show();
}

// builds the team nodes in settings
//
function addTeam(name) {

    var teamNode = $("<div></div>").attr('id', 'settingsTeam-' + name).attr('class', 'middle');

    var minusIcon = $("<img src='images/minus.png'></img>")
        .attr('id', 'settingsDelete-' + name)
        .attr('title', 'Delete ' + name)
        .attr('onClick', "$('" + "#settingsTeam-" + name + "').remove()");
    teamNode.append(minusIcon);

    var teamName = $("<input type='text' class='' />").val(name)
        .attr('class', 'teamName');
    teamNode.append(teamName);

    // only allow team names a-Z and 0-9
    teamName.bind("keyup", function (e) {
        this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    });

    var colorPicker = $("<input/>")
        .attr('type', 'text')
        .attr('id', 'settingscolor-' + name)
        .attr('class', 'colorPicker');
    teamNode.append(colorPicker);

    $('.settingsTeams').append(teamNode);
}

// adds a new team
//
function newTeam() {

    // how many current teams?
    var teamCount = $('.settingsTeams').find('.teamName').length;

    if (teamCount === 8) {
        window.alert("This version has a maximum team count of " + teamCount);
        return;
    }

    var name = Math.random().toString(36).substr(2, 5) + '-' + (teamCount + 1);
    addTeam(name);
    // var randomColor = '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
    var randomColor = 'hsla(' + (Math.floor(Math.random()*360)) + ', 100%, 70%, 1)';
    spectrumIt('#settingscolor-' + name, randomColor);
}

// Hide settings screen
//
function closeSettings() {
    $('#settingsScreen').hide();
}

// Save settings
//
function saveSettings() {

    var teamNames = $('.settingsTeams').find('.teamName');
    var teamColors = $('.settingsTeams').find('.colorPicker');

    teams = [];

    teamNames.each(function (index, team) {

        var teamName = team.value;
        var teamColor = $('#' + teamColors[index].id).spectrum("get").toHexString();

        var t = new Team(teamName, teamColor);
        teams.push(t);
    });


    saveCookie();

    buildScoreTable();

    $('#settingsScreen').hide();
}

// Gets team cookie, 
// returns default data if no cookie found
//
function getTeamCookie() {

    var teamStr = Cookies.get("teams");
    if (teamStr) {
        return JSON.parse(teamStr);
    } else {
        return [
            { name: 'team1', color: '#8a3be5' },
            { name: 'team2', color: '#f65f3f' },
            { name: 'team3', color: '#e0657f' },
            { name: 'team4', color: '#9ff76f' }
        ];
    }
}

// Saves team cookie
//
function saveCookie() {

    var teamStr = JSON.stringify(teams);
    Cookies.set("teams", teamStr, { expires: 365, path: '' });
}

// Create color picker
//
function spectrumIt(team, color) {

    $(team).spectrum({
        color: color,
        // showInput: true,
        className: "full-spectrum",
        // showInitial: true,
        // showPalette: true,
        // showSelectionPalette: true,
        // maxSelectionSize: 10,
        preferredFormat: "hex",
        localStorageKey: "placer-colorpicker",
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
}

// Build score table
//
function buildScoreTable() {

    // clear score table
    for (let i of ['0', '1', '2']) {
        $('#' + 'score_table_row' + i).empty();
        $('#' + 'score_table_placer_row' + i).empty();
    }

    var teamNumber = 0;
    teams.forEach(function(team) {

        var row = Math.floor(teamNumber / 4);

        var name = team.name;
        var color = team.color;

        // build the TD that holds the score and team button

        var td = $('<td/>', {
            class: 'tdteam',
            align: 'center'
        });

        var p = $('<div/>', {
            class: 'scoreteam',
            id: name + 'score'
        });
        p.text('0');
        td.append(p);

        var input = $('<input/>', {
            class: 'buttonteam',
            id: name + 'button',
            type: 'button',
            value: name,
            style: 'background: ' + color,
            onclick: 'addTime("' + name + '");'
        });
        td.append(input);

        $('#' + 'score_table_row' + row).append(td);

        // build the TD that holds the placers

        var tdp = $('<td/>', {
            class: 'tdplacer',
            valign: 'top'
        });

        var div = $('<div/>', {
            class: 'teamplacer',
            valign: 'top',
            id: name
        });
        tdp.append(div);

        $('#' + 'score_table_placer_row' + row).append(tdp);

        teamNumber++;
    });
}

//
//
function showCookiePolicy() {
    window.location.assign("/cookies.html");
}


// Looks to see if user has accepted the Cookie Policy
//
function acceptedCookie() {
    var policy = Cookies.get("cookiePolicy");
    if (policy) {
        return true;
    }
    return false;
}

//
//
function helpScreen1() {
    // make visible
    $('#helpScreen1').show();
}

//
//
function helpScreen1Next() {
    setup();

    // hide
    $('#helpScreen1').hide();
}

//
//
function setup() {

    // load saved teams from cookie 
    // or return defaults if no cookie found
    teams = getTeamCookie();

    // rebuild score table
    buildScoreTable();
}

//
//
function showSettings() {
    window.location.assign("/settings.html");
}

//
//
function showHelp() {
    window.location.assign("/help.html");
}

// Main
//
$(function () {

    if (acceptedCookie()) {
        setup();
    } else {
        showCookiePolicy();
    }
});
