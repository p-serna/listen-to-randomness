function play_sound(size, type, volume) {
    var max_pitch = 100.0;
    var log_used = 1.0715307808111486871978099;
    var pitch = 100 - Math.min(max_pitch, Math.log(size + log_used) / Math.log(log_used));
    var index = Math.floor(pitch / 100.0 * Object.keys(celesta).length);
    var fuzz = Math.floor(Math.random() * 4) - 2;
    index += fuzz;
    index = Math.min(Object.keys(celesta).length - 1, index);
    index = Math.max(1, index);
    if (current_notes < note_overlap) {
        current_notes++;
        if (type == 'add') {
            celesta[index].play();
        } else {
            clav[index].play();
        }
        setTimeout(function() {
            current_notes--;
        }, note_timeout);
    }
}

function play_random_swell() {
    var index = Math.round(Math.random() * (swells.length - 1));
    swells[index].play();
}

var make_click_handler = function($box, setting) {
    return function() {
            if ($box.is(':checked')) {
                enable(setting);
            } else {
                disable(setting);
            }
        };
};

function getChromeVersion () {
    // From https://stackoverflow.com/questions/4900436/how-to-detect-the-installed-chrome-version
    // Thanks, Dan.
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
}
