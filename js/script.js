window.onload = () => {

    //declare variables

    const Elements = {
        phoneWrapper : document.getElementById('phone-wrapper'),
        phoneVideo : document.getElementById('phone-video'),
        rangeWrapp : document.getElementById('range-wrapper'),
        rangeText : document.getElementById('range-notify'),
        textWrapp : document.getElementById('text-wrapper'),
        buttonWrapp : document.getElementById('buy-btn'),
        loaderWrapp : document.getElementById('loader-wrapp'),
        phoneVideoWrapper : document.getElementById('phone-video'),
        inputRange : document.getElementById('range'),
        phoneInternals : document.getElementById('internals'),
        flashWrapp : document.getElementById('flash-wrapp'),
        rainWrapp : document.getElementById('rain-wrapp')
    };

    /**
     *
     * @param rangeValue - Input range value
     * @
     */

    // function that changes phone's background and shows internals of phone

    const changePhoneBackground = (rangeValue) => {
                let totalFrames = 59 , //set total frames
                    frameHeight = 100/totalFrames; //receive height percentage

        Elements.phoneWrapper.style.backgroundPositionY = frameHeight*rangeValue + "%"; //get background position in percentage

        if (rangeValue == 59) {
            Elements.phoneWrapper.classList.add('invisible');
            Elements.phoneInternals.classList.add('visible');
        } else {
            Elements.phoneWrapper.classList.remove('invisible');
            Elements.phoneInternals.classList.remove('visible');
        }
    };

    // function that changes text

    const textChange = (rangeValue) => {
        let textArray = document.querySelectorAll(".text");
        const toggleActiveText = (position) => {
        for (let i = 0; i < textArray.length; i++) {
            textArray[i].classList.remove('active');
        }
            textArray[position].classList.add('active');
        };
        if (rangeValue == 0 && rangeValue < 15) {
            toggleActiveText(0);
        } else if (rangeValue > 14 && rangeValue < 29) {
            toggleActiveText(1);
        } else if (rangeValue > 28 && rangeValue < 44) {
            toggleActiveText(2);
        } else if (rangeValue > 43) {
            toggleActiveText(3);
        }
    };

    //function that hides and shows video

    const hideVideo = (rangeValue) => {
        if (rangeValue > 1) {
            Elements.phoneVideoWrapper.classList.add('hidden');
            Elements.phoneVideoWrapper.pause();
        } else {
            Elements.phoneVideoWrapper.classList.remove('hidden');
            Elements.phoneVideoWrapper.play();
        }
    };


    //function that shows flash

    const showFlash = (rangeValue) => {
        if (rangeValue == 29) {
            Elements.flashWrapp.classList.add('active');
            setTimeout(() => {
            Elements.flashWrapp.classList.remove('active');
            }, 300)
        }
    };

    //rain drops init

    class Rains {
        constructor() {
            this.isRaining = false;
            this.rainDrops = [];
            this.rainWrapp = Elements.rainWrapp;
        }
        createRains() {

            for ( let i = 1; i < randomNumber( 80, 120 ); i++ ) {
                let dropNumber = randomNumber(1, 4),
                    newClass = 'rain-drop' + dropNumber;

                let newRainDrop = document.createElement('div');

                newRainDrop.className = newClass;
                newRainDrop.classList.add('active');

                let leftPos = randomNumber(0, 689);
                let topPos = randomNumber(0, 320);

                newRainDrop.style.left = leftPos + 'px';
                newRainDrop.style.top = topPos + 'px';

                this.rainDrops.push(newRainDrop);

            }
        }

        renderRains() {
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
                    }, randomNumber(50, 200) * index);
                }).then(() => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            this.rainWrapp.removeChild(item);
                            resolve();
                        }, 2000)
                    });
                });
            });

            Promise.all(this.rainDrops).then(() => {
                this.rainDrops = [];
                this.isRaining = false;
            });
        }
    }


    let rains = new Rains();

    //function that shows rain raindrops

    function rainDropsShow(rangeValue) {

        if (rangeValue > 10 && rangeValue < 29) {
            rains.renderRains();
            Elements.rainWrapp.classList.add('visible');
        } else {
            Elements.rainWrapp.classList.remove('visible');
        }

    }

    //function that close widget on click

    function closeWidget() {
        let closeWidgetIcon = document.getElementById('close-link'),
            widgetWrapper = document.getElementById('outer-container');
        closeWidgetIcon.addEventListener('click', function() {
            widgetWrapper.classList.add('hidden');
                Elements.phoneVideoWrapper.classList.add('hidden');
                Elements.phoneVideoWrapper.pause();
        }, false);
    }

    //randomise numbers function

    const randomNumber = (min,max) => {
        let randomNumber = Math.floor(Math.random()*(max-min+1)+min);
        return randomNumber;
    };

    //preload function

    const preLoad = () => {

            Elements.phoneVideoWrapper.pause();

        setTimeout(() => {
            Elements.phoneVideoWrapper.play();
            Elements.phoneWrapper.classList.remove('hidden');
            Elements.phoneVideo.classList.remove('hidden');
            Elements.rangeWrapp.classList.remove('hidden');
            Elements.rangeText.classList.remove('hidden');
            Elements.textWrapp.classList.remove('hidden');
            Elements.buttonWrapp.classList.remove('hidden');
            Elements.loaderWrapp.style.display = 'none';
        }, 2000)
    };

    // initialize functions

    closeWidget();
    preLoad();

    Elements.inputRange.addEventListener('input', function (e) {
        let rangeValue = e.target.value;
        changePhoneBackground(rangeValue);
        textChange(rangeValue);
        hideVideo(rangeValue);
        showFlash(rangeValue);
        rainDropsShow(rangeValue);
    }, false);

};

