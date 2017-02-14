window.onload = function () {

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

    //rain drops init

    function Rains() {
        this.isRaining = false;
        this.rainDrops = [];
        this.rainWrapp = document.getElementById('rain-wrapp');
    }

    Rains.prototype = {
        constructor: Rains,
        createRains: function() {

            for ( var i = 1; i < randomNumber( 40, 80 ); i++ ) {
                var dropNumber = randomNumber(1, 4),
                    newClass = 'rain-drop' + dropNumber;

                var newRainDrop = document.createElement('div');

                newRainDrop.className = newClass;
                newRainDrop.classList.add('active');

                var leftPos = randomNumber(0, 689);
                var topPos = randomNumber(0, 320);

                newRainDrop.style.left = leftPos + 'px';
                newRainDrop.style.top = topPos + 'px';

                this.rainDrops.push(newRainDrop);

            }
        },

        renderRains: function() {
            if (this.isRaining) {
                return;
            }

            this.isRaining = true;

            this.createRains();

            this.rainDrops = this.rainDrops.map((item, index) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        this.rainWrapp.appendChild(item);
                        resolve();
                    }, randomNumber(100, 300) * index);
                }).then(() => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            this.rainWrapp.removeChild(item);
                            resolve();
                        }, 1000)
                    });
                });
            });

            Promise.all(this.rainDrops).then(() => {
                this.rainDrops = [];
                this.isRaining = false;
            });
        }
    };

    var rains = new Rains();

    //function that shows rain raindrops

    function rainDropsShow(rangeValue) {
        var rainWrapp = document.getElementById('rain-wrapp');

        if (rangeValue > 10 && rangeValue < 29) {
            rains.renderRains();
            rainWrapp.classList.add('visible');
        } else {
            rainWrapp.classList.remove('visible');
        }

    }

    //function that close widget on click

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


    var res = document.getElementById("range"); //input range variable

    // initialize functions

    closeWidget();

    res.addEventListener('input', function (e) {
        var rangeValue = e.target.value;
        changePhoneBackground(rangeValue);
        textChange(rangeValue);
        hideVideo(rangeValue);
        showFlash(rangeValue);
        rainDropsShow(rangeValue);
    }, false);

};

