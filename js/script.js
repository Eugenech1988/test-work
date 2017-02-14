window.onload = function () {

    var res = document.getElementById("range"); //input range variable

    // initialize functions

    closeWidget();

    res.addEventListener('input', function (e) {
        var rangeValue = e.target.value;
        changePhoneBackground(rangeValue);
        textChange(rangeValue);
        hideVideo(rangeValue);
        showFlash(rangeValue);
        rainDrops(rangeValue);
    }, false);

    /**
     *
     * @param rangeValue - Input range value
     * @
     */

    // function that changes phone's background and shows internals of phone

    function changePhoneBackground(rangeValue) {
                var phone = document.getElementById("phone-wrapper"),
                    phoneInternals = document.getElementById('internals'),
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
        var textArray = document.querySelectorAll(".text");
        function toggleActiveText(position) {
        for (var i = 0; i < textArray.length; i++) {
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
            phoneVideoWrapper.pause();
        } else {
            phoneVideoWrapper.classList.remove('hidden');
            phoneVideoWrapper.play();
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

        var newRainDrop = document.createElement('div'),
            dropNumber = randomNumber(1, 4),
            newClass = 'rain-drop' + dropNumber,
            rainWrapp = document.getElementById('rain-wrapp');

        if (rangeValue > 10 && rangeValue < 29) {
            rainWrapp.classList.add("visible");

            newRainDrop.className = newClass;
            newRainDrop.classList.add('active');
            rainWrapp.appendChild(newRainDrop);

            var leftPos = randomNumber(0, 689);
            var topPos = randomNumber(0, 320);

            newRainDrop.style.left = leftPos + 'px';
            newRainDrop.style.top = topPos + 'px';
            setTimeout(function () {
                rainWrapp.removeChild(newRainDrop)
            }, 1000)
        } else {
            rainWrapp.classList.remove('visible');
        }
    }

    // close click function

    function closeWidget() {
        var closeWidgetIcon = document.getElementById('close-link'),
            widgetWrapper = document.getElementById('outer-container'),
            phoneVideoWrapper = document.getElementById('phone-video');
        closeWidgetIcon.addEventListener('click', function() {
            widgetWrapper.classList.add('hidden');
                phoneVideoWrapper.classList.add('hidden');
                phoneVideoWrapper.pause();
        }, false);
    }

    //randomise numbers function

    function randomNumber(min,max) {
        var randomNumber = Math.floor(Math.random()*(max-min+1)+min);
        return randomNumber;
    }
    
};

