window.onload = function () {
    
    var res = document.getElementById("range"); //input range variable

    // initialize functions

    videoInit();
    closeWgit idget();

    res.addEventListener('input', function (e) {
        var rangeValue = e.target.value;
        changePhoneBackground(rangeValue);
        textChange(rangeValue);
        hideVideo(rangeValue);
        showFlash(rangeValue);
        rainDrops(rangeValue);
    });

    /**
     *
     * @param rangeValue - Input range value
     * @
     */

    // function that changes phone's background and shows internals of phone

    function changePhoneBackground(rangeValue) {
                var phone = document.getElementById("phone-wrapper"), //wrapper of phone
                    phoneInternals = document.getElementById('internals'), //internals of phone wrapper
                    totalFrames = 59 , //set total frames
                    frameHeight = 100/totalFrames; //receive height percentage
                phone.style.backgroundPositionY = frameHeight*rangeValue + "%"; //get background position in percentage
        if (rangeValue == 59) {
            phone.classList.add('invisible');
            phoneInternals.classList.add('visible');
        } else {
            phone.classList.remove('invisible');
            phoneInternals.classList.remove('visible');
        }
    }

    // function that changes text

    function textChange(rangeValue) {
        var textArray = document.querySelectorAll(".text"); //create array with elements width class 'text'
        function toggleActiveText(position) {
        for (var i = 0; i < textArray.length; i += 1) {
        textArray[i].classList.remove('active');
        }
        textArray[position].classList.add('active');
        }
        if (rangeValue == 0 && rangeValue < 15) {
            toggleActiveText(0);
        } else if (rangeValue > 14 && rangeValue < 29) {
            toggleActiveText(1);
        } else if (rangeValue > 28 && rangeValue < 44) {
            toggleActiveText(2);
        } else if (rangeValue > 43) {
            toggleActiveText(3);
        }
    }

    //function that hides and shows video

    function hideVideo(rangeValue) {
        var phoneVideoWrapper = document.getElementById('phone-video');
        if (rangeValue > 1) {
            phoneVideoWrapper.classList.add('hidden');
        } else {
            phoneVideoWrapper.classList.remove('hidden');
        }
    }


    //function that shows flash

    function showFlash(rangeValue) {
        var flash = document.getElementById('flash-wrapp');
        if (rangeValue == 29) {
            flash.classList.add('active');
            setTimeout(function () {
            flash.classList.remove('active');
            }, 300)
        }
    }

    //function that shows raindrops

    function rainDrops(rangeValue) {
        if (rangeValue > 10 && rangeValue < 27) {
        console.log(1);
        }
    }

    // close click function

    function closeWidget() {
        var closeWidgetIcon = document.getElementById('close-link'), //close-link-wrapper
            widgetWrapper = document.getElementById('outer-container'); //widget-container
        closeWidgetIcon.addEventListener('click', function() {
            widgetWrapper.classList.add('hidden');
        }, false);
    }

    //function that shows embedded video

    function videoInit() {
        var player;
            // phoneVideoWrapp = document.getElementById('phone-video');
        player = new YT.Player('phone-video', {  //declare player in the block with id phone-video
            videoId: '9xKR8Vcjias',
            width: 363,
            height: 203,
            playerVars: {
                autoplay: 1,
                controls: 1,
                showinfo: 0,
                modestbranding: 1,
                loop: 1,
                fs: 0,
                cc_load_policy: 0,
                iv_load_policy: 3,
                autohide: 0
            },
            events: {
                onReady: function (e) {
                    e.target.mute();
                }
            }
        });
    }
};