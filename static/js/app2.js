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

/* Languages
   ========= */

var langs = {
    'en': ['English', 'ws://wikimon.hatnote.com:9000'],
    'de': ['German', 'ws://wikimon.hatnote.com:9010'],
    'ru': ['Russian', 'ws://wikimon.hatnote.com:9020'],
    'uk': ['Ukrainian', 'ws://wikimon.hatnote.com:9310'],
    'ja': ['Japanese', 'ws://wikimon.hatnote.com:9030'],
    'es': ['Spanish', 'ws://wikimon.hatnote.com:9040'],
    'fr': ['French', 'ws://wikimon.hatnote.com:9050'],
    'nl': ['Dutch', 'ws://wikimon.hatnote.com:9060'],
    'it': ['Italian', 'ws://wikimon.hatnote.com:9070'],
    'sv': ['Swedish', 'ws://wikimon.hatnote.com:9080'],
    'ar': ['Arabic', 'ws://wikimon.hatnote.com:9090'],
    'fa': ['Farsi', 'ws://wikimon.hatnote.com:9210'],
    'he': ['Hebrew' , 'ws://wikimon.hatnote.com:9230'],
    'id': ['Indonesian', 'ws://wikimon.hatnote.com:9100'],
    'zh': ['Chinese', 'ws://wikimon.hatnote.com:9240'],
    'as': ['Assamese', 'ws://wikimon.hatnote.com:9150'],
    'hi': ['Hindi', 'ws://wikimon.hatnote.com:9140'],
    'bn': ['Bengali', 'ws://wikimon.hatnote.com:9160'],
    'pa': ['Punjabi', 'ws://wikimon.hatnote.com:9120'],
    'te': ['Telugu', 'ws://wikimon.hatnote.com:9165'],
    'ta': ['Tamil', 'ws://wikimon.hatnote.com:9110'],
    'ml': ['Malayalam', 'ws://wikimon.hatnote.com:9250'],
    'mr': ['Western Mari', 'ws://wikimon.hatnote.com:9130'],
    'kn': ['Kannada', 'ws://wikimon.hatnote.com:9170'],
    'or': ['Oriya', 'ws://wikimon.hatnote.com:9180'],
    'sa': ['Sanskrit', 'ws://wikimon.hatnote.com:9190'],
    'gu': ['Gujarati' , 'ws://wikimon.hatnote.com:9200'],
    'pl': ['Polish' , 'ws://wikimon.hatnote.com:9260'],
    'mk': ['Macedonian' , 'ws://wikimon.hatnote.com:9270'],
    'be': ['Belarusian' , 'ws://wikimon.hatnote.com:9280'],
    'sr': ['Serbian' , 'ws://wikimon.hatnote.com:9290'],
    'bg': ['Bulgarian' , 'ws://wikimon.hatnote.com:9300'],
    'hu': ['Hungarian', 'ws://wikimon.hatnote.com:9320'],
    'fi': ['Finnish', 'ws://wikimon.hatnote.com:9330'],
    'no': ['Norwegian', 'ws://wikimon.hatnote.com:9340'],
    'el': ['Greek', 'ws://wikimon.hatnote.com:9350'],
    'eo': ['Esperanto', 'ws://wikimon.hatnote.com:9360'],
'pt': ['Portuguese', 'ws://wikimon.hatnote.com:9370'],
'et': ['Estonian', 'ws://wikimon.hatnote.com:9380'],
    'wikidata': ['Wikidata' , 'ws://wikimon.hatnote.com:9220']
}

/*
   ============== */

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

var user_announcements = false;
setTimeout(function() {
    user_announcements = true;
}, 20000);

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
    // :(
    $('head').append('<style type="text/css">.newuser-label {fill:' + svg_text_color +
                     ';} .bot {fill:' + bot_color +
                     ';} .anon {fill:' + anon_color +
                     ';} .bot </style>');
    $('body').append('<div id="loading"><p>Loading sound files ...</p></div>')

    var svg = d3.select("#area").append("svg")
        .attr({width: width, height: height})
        .style('background-color', '#1c2733');

    var update_window = function() {
        width = w.innerWidth || e.clientWidth || g.clientWidth;
        height = (w.innerHeight  - $('#header').height())|| (e.clientHeight - $('#header').height()) || (g.clientHeight - $('#header').height());

        svg.attr("width", width).attr("height", height);
        if (epm_text) {
            epm_container.attr('transform', 'translate(0, ' + (height - 25) + ')')
        }
        update_tag_warning();
        /*rate_bg.attr("width", width).attr("height", height);*/
    }

    window.onresize = update_window;

    $('#welcome').click(make_click_handler($('#welcome'), 'nowelcomes')
    );
    $('#titles').click(
        make_click_handler($('#titles'), 'notitles')
    );
    $('#background_mode').click(
        function() {$("#area svg").toggle();}
    );
    $('#hide_rc_box').click(
        function() {$("#rc-log").toggle();}
    );

    $('#about-link').click(function(){
        // because we use window.location to set languages.
        $('html, body').animate({scrollTop:$(document).height()}, 'slow');
        return false;
    });

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

    /*
    function testuser() {
        data = {user: 'Slaporte'}
        newuser_action(data, 'en', svg)
    }

    testuser()
    */

    for (lang in langs) {
        if (langs.hasOwnProperty(lang)) {
            if (lang == 'wikidata') {
                $('#lang-boxes').append('<p><input type="checkbox" name="' + langs[lang][0] + '" id="' + lang + '-enable"/><label for="' + lang + '-enable">' + langs[lang][0] + ' <span class="conStatus" id="' + lang + '-status"></span></label></p>')
            } else {
                $('#lang-boxes').append('<p><input type="checkbox" name="' + langs[lang][0] + '" id="' + lang + '-enable"/><label for="' + lang + '-enable">' + langs[lang][0] + ' Wikipedia <span class="conStatus" id="' + lang + '-status"></span></label></p>')
            }
            SOCKETS[lang] = new wikipediaSocket.init(langs[lang][1], lang, svg);
            var box = $('#' + lang + '-enable');
            if (box.is(':checked')) {
                enable(lang)
            }
            box.click(make_click_handler(box, lang));
        }
    }

    enabled_langs = return_lang_settings();

    if (!enabled_langs.length) {
        enabled_langs.push(DEFAULT_LANG)
    }
    for (var i = 0; i < enabled_langs.length + 1; i ++) {
        var lang = enabled_langs[i];
        $('#' + lang + '-enable').prop('checked', true);
        if (SOCKETS[lang] && (!SOCKETS[lang].connection ||
                              SOCKETS[lang].connection.readyState == 3)) {
            SOCKETS[lang].connect();
        }
    }
  $('#filter').tagsInput({
    height: '45px',
    width: '80%',
    'delimiter': [' ', ','],
    defaultText: 'Add a tag',
    defaultTextWidth: 100,
    unique: false,
    onChange: function() {
      TAG_FILTERS = [];
      $('.tag span').each(function(val) {
          var tag = $(this).text().trim().replace('#', '').toLowerCase();
          if($.inArray(tag, TAG_FILTERS) === -1){
            TAG_FILTERS.push(tag);
          }
      });
      update_tag_warning(svg);
      console.log('Watching for: ' + TAG_FILTERS)
    }
  });

})