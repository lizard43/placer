//
// https://lizard43.com
//

// Shows the settings screen.
// Builds selections to change team name and color
//
function showSettings() {

    $('.settingsTeams').empty();

    var teams = getTeamCookie();

    teams.forEach(team => {

        var name = team.name;

        addTeam(name)
    });

    // create color pickers
    teams.forEach(team => {
        spectrumIt('#settingscolor-' + team.name, team.color);
    });
}

// builds the team nodes
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

    var name = 'T' + Math.random().toString(36).substr(2, 5) + (teamCount + 1);
    addTeam(name);
    // var randomColor = '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
    var randomColor = 'hsla(' + (Math.floor(Math.random() * 360)) + ', 100%, 70%, 1)';
    spectrumIt('#settingscolor-' + name, randomColor);
}

// Save settings
//
function saveSettings() {

    var teamNames = $('.settingsTeams').find('.teamName');
    var teamColors = $('.settingsTeams').find('.colorPicker');

    var teams = [];

    teamNames.each(function (index, team) {

        var teamName = team.value;
        var teamColor = $('#' + teamColors[index].id).spectrum("get").toHexString();

        var t = new Team(teamName, teamColor);
        teams.push(t);
    });

    saveTeamCookie(teams);

    window.location.assign("/");
}

// Gets team cookie, 
// returns default data if no cookie found
//
function getTeamCookie(teams) {

    var teamStr = Cookies.get("teams");
    if (teamStr) {
        return JSON.parse(teamStr);
    } else {
        return [
            { name: 'team1', color: '#8a3be5' },
            { name: 'team2', color: '#ffffff' }
        ];

    }
}

// Saves team cookie
//
function saveTeamCookie(teams) {

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

//
//
function cancelSettings() {
    window.location.assign("/");
}

// Main
//
$(function () {

    showSettings();

});
