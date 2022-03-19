var global_mute = false;
var global_volume = 50;
var TAG_FILTERS = [];
var DEBUG = false;

$(function(){

    Howler.volume(global_volume * .01);

    $("#volumeControl").click(function() {
    if (!global_mute) {
        global_mute = false;
        Howler.mute();
        $("#volumeControl").css("background-position", "0 0");
    } else {
        global_mute = false;
        Howler.unmute();
        $("#volumeControl").css("background-position", "0 -46px");
    }
    });

    $("#volumeSlider").noUiSlider({
    range : [-99, 0],
    start : 0,
    handles : 1,
    step : 1,
    orientation : "horizontal",
    slide : function() {
        global_volume = 100 + $(this).val();
        var howler_volume = global_volume * 0.01;
        if (howler_volume <= 0.01) {
        Howler.mute();
        } else {
        Howler.unmute();
        Howler.volume(global_volume * .01);
        }
    }});

});


/* Settings
   ======== */

var scale_factor = 5,
    note_overlap = 15,
    note_timeout = 300,
    current_notes = 0,
    max_life = 60000,
    DEFAULT_LANG = 'en';

/* Colors
   ====== */

var body_background_color = '#f8f8f8',
    body_text_color = '#000',
    svg_background_color = '#1c2733',
    svg_text_color = '#fff',
    newuser_box_color = 'rgb(41, 128, 185)',
    bot_color = 'rgb(155, 89, 182)',
    anon_color = 'rgb(46, 204, 113)',
    edit_color = '#fff',
    sound_totals = 51,
    total_edits = 0;

var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('#area svg')[0],
    width = w.innerWidth || e.clientWidth || g.clientWidth;
    height = (w.innerHeight  - $('#header').height())|| (e.clientHeight - $('#header').height()) || (g.clientHeight - $('#header').height());

var celesta = [],
    clav = [],
    epm = 0,
    edit_times = [],
    SOCKETS = {},
    swells = [],
    all_loaded = false,
    s_titles = true,
    s_welcome = true,
    s_langs = [];

$(function(){

    // Chrome 66 Autoplay Policy Compliance
    if (getChromeVersion() >= 66){
        if (Howler.ctx.state == 'suspended') {
            $('.about-link').prepend('<a class="unmute" href="#">enable sound?</a>');
        }
        $(document).click(function() { 
            Howler.ctx.resume().then($('.unmute').fadeOut());
        });
    }

    $('body').css('background-color', body_background_color)
    $('body').css('color', body_text_color)
    $('svg').css('background-color', svg_background_color)
    $('svg text').css('color', svg_text_color)
    $('head').append('<style type="text/css">.newuser-label {fill:' + svg_text_color +
                     ';} .bot {fill:' + bot_color +
                     ';} .anon {fill:' + anon_color +
                     ';} .bot </style>');
    $('body').append('<div id="loading"><p>Loading sound files ...</p></div>')

    var svg = d3.select("#area").append("svg")
        .attr({width: width, height: height})
        .style('background-color', '#1c2733');


    // TODO: Volume slider?
    var loaded_sounds = 0
    var sound_load = function(r) {
        loaded_sounds += 1
        if (loaded_sounds == sound_totals) {
            all_loaded = true
            $('#loading').remove()
            console.log('Loading complete')
        } else {
            // console.log('Loading : ' + loaded_sounds + ' files out of ' + sound_totals)
        }
    }



    // load celesta and clav sounds
    for (var i = 1; i <= 24; i++) {
        if (i > 9) {
            fn = 'c0' + i;
        } else {
            fn = 'c00' + i;
        }
        celesta.push(new Howl({
            urls : ['sounds/celesta/' + fn + '.ogg',
                    'sounds/celesta/' + fn + '.mp3'],
            volume : 0.2,
            onload : sound_load(),
        }))
        clav.push(new Howl({
            urls : ['sounds/clav/' + fn + '.ogg',
                    'sounds/clav/' + fn + '.mp3'],
            volume : 0.2,
            onload : sound_load(),
        }))
    }

    // load swell sounds
    for (var i = 1; i <= 3; i++) {
        swells.push(new Howl({
            urls : ['sounds/swells/swell' + i + '.ogg',
                    'sounds/swells/swell' + i + '.mp3'],
            volume : 1,
            onload : sound_load(),
        }))
    }

})

async function registerSW(){
    if("serviceWorker" in navigator){
        try{
            await navigator.serviceWorker.register("./js/sw.js");
        } catch(e){
            console.log("SW registration failed");
        }
    }
}

registerSW();