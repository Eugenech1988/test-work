/**
 * Created by prophet on 11.02.2017.
 */

var creative = {};
var stage;
var canvas;
var images;
var rotate360Interval
var start_x;
var bmp;
var FrameToShow;
var showInternalsTimeline;
var entranceTimeline;
var highlightTimeline;
var flashTimeline;
var videoPlaying;
var currentText;
var nextText;
var positionPercentage;
var textTimeline;
var VideoIntroTimeout;
var ytp;
var muteCheckerInterval;
var userInteractedWithVideo = false;

var raining = false;
var rainTimer;

var RainDrops = [];


/**
 * Window onload handler.
 */
function preInit() {
    setupDom();
    reset ();
    CreateTimelines () ;

    if (Enabler.isInitialized()) {
        init();
    } else {
        Enabler.addEventListener(
            studio.events.StudioEvent.INIT,
            init
        );
    }
}

/**
 * Initializes the ad components
 */
function setupDom() {
    creative.dom = {};
    creative.dom.mainContainer = document.getElementById('main-container');
    creative.dom.exit = document.getElementById('exit');
    creative.dom.copy_1 = document.getElementById('copy_1');
    creative.dom.copy_2 = document.getElementById('copy_2');
    creative.dom.copy_3 = document.getElementById('copy_3');
    creative.dom.copy_4 = document.getElementById('copy_4');
    creative.dom.video_container = document.getElementById('video_container');
    creative.dom.highlights = document.getElementById('highlights');
    creative.dom.video_container = document.getElementById('video_container');
    creative.dom.internals = document.getElementById('internals');
    creative.dom.phone_wrapper = document.getElementById('phone-wrapper');
    creative.dom.dragbar = document.getElementById('dragbar');
    creative.dom.dragtext = document.getElementById('dragtext');
    creative.dom.cta = document.getElementById('cta');
    creative.dom.card_highlight = document.getElementById('card_highlight');
    creative.dom.flash = document.getElementById('flash');

}

/**
 * Ad initialisation.
 */
function init() {

    initBanner();

    addListeners();

    // Polite loading
    if (Enabler.isVisible()) {
        show();
    }
    else {
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, show);
    }
}


function addListeners() {
    creative.dom.exit.addEventListener('click', exitClickHandler);

}

function show() {
    creative.dom.exit.style.display = "block";
    showYTPlayer0('video_container');
}




// ---------------------------------------------------------------------------------
// NODE
// ---------------------------------------------------------------------------------

function CreateTimelines () {
    console.log('CreateTimelines');


    showInternalsTimeline = new TimelineMax({paused:true, onComplete:playHiglight});
    showInternalsTimeline.to(creative.dom.internals, 0.8, {delay:0, opacity:1, ease: Power2.easeOut});

    entranceTimeline = new TimelineMax({paused:true});
    entranceTimeline.to(creative.dom.phone_wrapper, 0.8, {delay:0, top:0, ease: Power2.easeOut});
    entranceTimeline.to(creative.dom.dragbar, 0.8, {delay:-0.6, top:25, ease: Power2.easeOut});
    entranceTimeline.to(creative.dom.dragtext, 1, {delay:-0, opacity:1});
    entranceTimeline.to(creative.dom.cta, 1, {delay:-0, opacity:1});



    highlightTimeline = new TimelineMax({paused:true, repeat:1});
    highlightTimeline.to(creative.dom.card_highlight, 0.3, {left:20, top:-70, ease: Power2.easeOut});

    flashTimeline = new TimelineMax({paused:true});
    flashTimeline.to(creative.dom.flash, 0.5, {scale:2.5, rotation:4000, ease: Power2.easeOut});
    flashTimeline.to(creative.dom.flash, 0.3, {delay:-0.3, opacity:0, ease: Power2.easeOut});
}

function flashCamera () {


    var timelineState = flashTimeline.isActive();
    if (!timelineState) {
        flashTimeline.gotoAndPlay(0)
    }

}

function playHiglight () {
    highlightTimeline.gotoAndPlay(0);
}


function initBanner() {

    setUpDrageBar () ;
    canvas = document.getElementById("canvas");
    if (!canvas || !canvas.getContext) return;
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(true);
    stage.mouseMoveOutside = true;
    createjs.Touch.enable(stage);

    images = [], loaded = 0, currentFrame = 0, totalFrames = imgList.length;
    rotate360Interval, start_x;
    bmp = new createjs.Bitmap();
    stage.addChild(bmp);
    console.log('totalFrames = ' + totalFrames)
    load360Image();
    // TICKER
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
}

function reset () {
    console.log('reset');
    creative.dom.copy_1.style.opacity = 0;
    creative.dom.copy_2.style.opacity = 0;
    creative.dom.copy_3.style.opacity = 0;
    creative.dom.internals.style.opacity = 0;
    creative.dom.copy_4.style.opacity = 0;
    creative.dom.phone_wrapper.style.top = 250 + 'px';
    creative.dom.dragbar.style.top = 250 + 'px';
    creative.dom.dragtext.style.opacity = 0;
    creative.dom.cta.style.opacity = 0;


    TweenLite.to(creative.dom.flash, 0, {scale:0, opacity:1});

    TweenLite.to(creative.dom.card_highlight, 0, {left:-90, top:-70, rotation:-45});
}


function setUpDrageBar () {
    Draggable.create(".box", {
        type:"y",
        bounds: document.getElementById("dragbar"),
        //throwProps:true,

        onClick:function() {
            console.log("clicked");
        },

        onDragEnd:function() {
            console.log("drag ended");
        },

        onDrag:function() {

            stopIntroTimeout()

            var currentPosition = this.y;
            positionPercentage = Math.round(currentPosition / 180 * 100);
            var previousFrame = FrameToShow
            FrameToShow = Math.round((positionPercentage/100) * totalFrames)

            checkText ();

            if (positionPercentage > 48 && positionPercentage < 52) {
                flashCamera();
            }


            if (FrameToShow == totalFrames) {
                FrameToShow = totalFrames - 1;
                showInternals();
            } else {hideInternals();}

            console.log('positionPercentage = ' + positionPercentage)

            if (previousFrame != FrameToShow) {
                bmp.image = images[FrameToShow];
            }

            if (FrameToShow == 0 && !videoPlaying) {
                creative.dom.ytplayer0.play();
                creative.dom.highlights.style.display = 'block';
                creative.dom.video_container.style.display = 'block';
                videoPlaying = true;


            } else if (FrameToShow > 0) {
                videoPlaying = false;
                creative.dom.ytplayer0.pause();
                creative.dom.highlights.style.display = 'none';
                creative.dom.video_container.style.display = 'none';

            }

        }
    });
}

function load360Image() {
    var img = new Image();
    img.src = imgList[loaded];
    img.onload = img360Loaded;
    images[loaded] = img;
}


function img360Loaded(event) {
    loaded++;
    if(loaded==totalFrames) ImageSequenceLoaded ();
    else load360Image();
}

function ImageSequenceLoaded () {
    console.log('////// ImageSequenceLoaded //////////')
    update360(0);
    entranceTimeline.gotoAndPlay(0);
    switchText (creative.dom.copy_1)
    VideoIntroTimeout = setTimeout(OnVideoIntroTimeout, 25000);
}


function update360(dir) {
    currentFrame+=dir;
    if(currentFrame<0) currentFrame = totalFrames-1;
    else if(currentFrame>totalFrames-1) currentFrame = 0;
    bmp.image = images[currentFrame];
}


function handleTick() {
    stage.update();
}

function checkText () {

    if (positionPercentage <= 3) {
        switchText (creative.dom.copy_1);
        StopRain ()
    } else if (positionPercentage > 3 && positionPercentage <= 36) {
        switchText (creative.dom.copy_2);
        StartRain ();
    }  else if (positionPercentage > 36 && positionPercentage <= 77) {
        switchText (creative.dom.copy_3);
        StopRain ()
    } else {
        switchText (creative.dom.copy_4);
        StopRain ()
    }

}

function switchText ($textOB) {

    console.log('switchText')

    if (currentText == $textOB) {
        console.log('same text - break')
        return;
    }

    if (textTimeline) {
        textTimeline.pause();
    }

    textTimeline = new TimelineMax({paused:false});

    if (currentText != null) {
        textTimeline.to(currentText, 0, {opacity:0});
    }

    textTimeline.to($textOB, 2, {delay:0, opacity:1, ease: Power2.easeOut});

    currentText = $textOB;
}





function showInternals () {

    var timelineState = showInternalsTimeline.isActive();
    if (!timelineState) {
        showInternalsTimeline.gotoAndPlay(0);
    }

}
function hideInternals () {
    showInternalsTimeline.gotoAndStop(0);
    highlightTimeline.gotoAndStop(0);
}


function OnVideoIntroTimeout() {

    window.clearInterval(muteCheckerInterval);
    if (userInteractedWithVideo) {
        ///// dont stop the video if user has interacted
        return;
    }

    var PlayerState = ytp.a.getPlayerState();
    if (PlayerState == 1) {
        creative.dom.ytplayer0.pause();
        videoPlaying = false;
    }
}
function stopIntroTimeout () {
    clearTimeout(VideoIntroTimeout);
}


function StartRain () {

    if (raining) {
        return;
    }

    raining = true;
    console.log('StartRain')
    rainTimer = setInterval(NewRainDrop, 60);

    setInterval(function() {
        StopRain();
    }, 29000);
}
function StopRain () {

    if (!raining) {
        return;
    }

    RainDrops.forEach(function(entry) {
        TweenLite.to(entry, 0.5, {scale:0, opacity:0});
    });

    raining = false;
    console.log('StopRain')
    window.clearInterval(rainTimer);
}

function NewRainDrop () {
    var new_rainDrop = document.createElement( 'div' );

    RainDrops.push(new_rainDrop)
    //console.log(RainDrops)

    var DropClass = randomNumber(1, 4)
    //console.log('DropClass = ' + DropClass)

    var newClass = 'rainDrop_' + DropClass.toString();

    new_rainDrop.className = newClass;
    document.getElementById('rain_container').appendChild(new_rainDrop);

    var leftPos = randomNumber(270, 770);
    var topPos = randomNumber(0, 250);

    var initScale = randomNumber(40, 60) / 10;
    TweenLite.to(new_rainDrop, 0, {scale:initScale, opacity:0});

    new_rainDrop.style.left = leftPos + 'px';
    new_rainDrop.style.top = topPos + 'px';

    var duration = randomNumber(1, 5);
    var dropscale = randomNumber(1, 10) / 10;
    var falldelay = randomNumber(1, 5) / 10;

    var rain_tl = new TimelineMax({paused:false});
    rain_tl.timeScale(1);
    rain_tl.to(new_rainDrop, 0.2, {delay:0, scale:dropscale, opacity:1, ease: Back.easeOut.config(1.7)})
    rain_tl.to(new_rainDrop, duration, {delay:falldelay, top:topPos + 250, scaleX: 0.1, ease: Power2.easeIn})
    rain_tl.to(new_rainDrop, 0.5, {delay:-0.5, opacity:0})
}

function randomNumber(min,max)
{
    var num = Math.floor(Math.random()*(max-min+1)+min);
    //console.log('num = ' + num)
    return num;
}



function startMuteChecker() {
    muteCheckerInterval = setInterval(onVidMuteCheck, 500);
}

function onVidMuteCheck() {

    var muteStatus = ytp.a.isMuted();
    console.log('onVidMuteCheck = ' + muteStatus);

    if (!muteStatus) {
        userInteractedWithVideo = true;
    }


}



// ---------------------------------------------------------------------------------
// MAIN DC
// ---------------------------------------------------------------------------------

function exitClickHandler() {
    StopRain();
    console.log('exitClickHandler')

    if (creative.dom.ytplayer0 != null) {
        creative.dom.ytplayer0.pause();
        // creative.dom.ytplayer0.seek(0);
    }
    Enabler.exit('BackgroundExit');
}
/**
 * Shows the YT player.
 */




function showYTPlayer0(containerId) {

    console.log('show video')
    videoPlaying = true;

    if (!creative.dom.ytplayer0) {
        creative.ytplayer0Ended = false;
        creative.dom.ytplayer0 = document.createElement('gwd-youtube');
        ytp = creative.dom.ytplayer0;
        ytp.setAttribute('id', 'ytp-0');
        ytp.setAttribute('video-url', 'https://www.youtube.com/watch?v=9xKR8Vcjias');
        ytp.setAttribute('autoplay', 'standard'); // none, standard, preview, intro.
        ytp.setAttribute('preview-duration', '30'); // Only for &#39;preview&#39; autoplay mode.
        ytp.setAttribute('muted', 'true');
        // Adformat parameter for Mastheads.
        ytp.setAttribute('adformat', '1_8');
        ytp.setAttribute('controls', 'autohide'); // none, show, autohide.
        document.getElementById(containerId).appendChild(ytp);

        startMuteChecker();


        ytp.addEventListener('onStateChange', function() {
            console.log('onStateChange - NOT FIRING')
        }, false);

        ytp.addEventListener('playpressed', function() {

            if (ytp.a.isMuted()) {
                //ytp.toggleMute();
            }
            if (creative.ytplayer0Ended) {
                creative.ytplayer0Ended = false;
                Enabler.counter('YTP 0 replay', true);
            }
            Enabler.counter('YTP 0 play pressed', true);
        }, false);

        ytp.addEventListener('paused', function() {
            Enabler.counter('YTP 0 paused', true);
            stopIntroTimeout ();
        }, false);

        ytp.addEventListener('ended', function() {
            Enabler.counter('YTP 0 ended', true);
            creative.ytplayer0Ended = true;
        }, false);

        ytp.addEventListener('viewed0percent', function() {
            Enabler.counter('YTP 0 viewed 0%');
        }, false);

        ytp.addEventListener('viewed25percent', function() {
            Enabler.counter('YTP 0 viewed 25%');
        }, false);

        ytp.addEventListener('viewed50percent', function() {
            Enabler.counter('YTP 0 viewed 50%');
        }, false);

        ytp.addEventListener('viewed75percent', function() {
            Enabler.counter('YTP 0 viewed 75%');
        }, false);

        ytp.addEventListener('viewed100percent', function() {
            Enabler.counter('YTP 0 viewed 100%');
        }, false);

    }
    else {
        creative.dom.ytplayer0.style.display = 'block';
    }


}



/**
 * Removes the YTPlayer from the DOM.
 */
function hideYTPlayer0(containerId) {

    creative.dom.highlights.style.display = 'none';
    creative.dom.video_container.style.display = 'none';

    if (creative.dom.ytplayer0 != null) {
        creative.dom.ytplayer0.pause();
        creative.dom.ytplayer0.style.display = 'none';
        videoPlaying = false;
    }
}

/**
 *  Main onload handler
 */
window.addEventListener('load', preInit);