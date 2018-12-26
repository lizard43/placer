//
// https://lizard43.com
//

//
//
function acceptCookiePolicy() {

    Cookies.set("cookiePolicy", JSON.stringify({ accepted: true, date: new Date() }),
        { expires: 365, path: '' });

    window.location.assign("/help.html");
}

// Main
//
$(function () {
});
