let audio = $('audio')[0]
let time = $(".time")[0];

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

let playlist;
let currentPlaylist;
let track;
 
function switchTreck (numTreck) {
    audio.src = './playlist/'+ currentPlaylist+'/' + playlist[numTreck];
    $('.track__name').text(playlist[numTreck].split('.')[0])
    audio.currentTime = 0;
    $('.track').removeClass('choose')
    $('.track').eq(numTreck).addClass('choose')
    startPlay()
}

window.onload = function() {
    currentPlaylist = getUrlParameter('playlist')
    track = 0
    $.ajaxSetup({
        'beforeSend' : function(xhr) {
            xhr.overrideMimeType('text/html; charset=UTF-8');
        },
    });

    $.ajax({
        async: false,
        url: './playlist_txt/'+currentPlaylist+'.txt',
        method: 'get',
        scriptCharset: "utf-8",
        cache: false,
        contentType: "utf-8",
        success: function (data) {
            playlist = data.split(/\r?\n/)
        }
    })

    playlist.forEach(el => {
        if (el !== '') {
            $('.tracks').append('<p class="track">'+el.split('.')[0]+'</p>')
        }
    });
    $('.tracks').children('p:first').addClass('choose')

    if (playlist.length === 1) {
        $('.tracks').addClass('none')
    }

    audio.src = './playlist/'+ currentPlaylist+'/' + playlist[track];
    $('.track__name').text(playlist[track].split('.')[0])
}

function startPlay() {
    audio.play();

    $('.play').addClass('none')
    $('.pause').removeClass('none')

    audioPlay = setInterval(function() {
        let audioTime = Math.round(audio.currentTime);
        let audioLength = Math.round(audio.duration)


        
        time.style.width = (audioTime * 100) / audioLength + '%';
        if (audioTime == audioLength && track < playlist.length - 1) {
            track++; 
            switchTreck(track); 
        } else if (audioTime == audioLength && track == playlist.length - 1) {
            track = 0;
            switchTreck(track);
        }
    }, 10)
}

$(document).on('click', '.audio__track', function (event) {
    let x = event.pageX - $('.audio__track').offset().left
    let y = 100 * x / $('.audio__track')[0].offsetWidth
    audio.currentTime =  (y * audio.duration / 100)
    startPlay()
})

$(document).on('click', '.play', function () {
    startPlay()
})

$(document).on('click', '.pause', function () {
    audio.pause();
    $('.pause').addClass('none')
    $('.play').removeClass('none')
    clearInterval(audioPlay)
});

$(document).on('click', '.track', function () {
    $('.track').removeClass('choose')
    $(this).addClass('choose')
    track = $(this).index();
    switchTreck($(this).index())
});