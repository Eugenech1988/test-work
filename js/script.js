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
        rainWrapp : document.getElementById('rain-wrapp'),
        textArray : document.querySelectorAll('.text'),
        closeWidgetIcon : document.getElementById('close-link'),
        widgetWrapper : document.getElementById('outer-container')
    };

    /**
     *
     * @param rangeValue - Input range value
     *
     */

    // function that changes phone's background and shows internals of phone

    const changePhoneBackground = (rangeValue) => {
                let totalFrames = 59 , //set total frames
                    frameHeight = 100/totalFrames; //receive height percentage

        Elements.phoneWrapper.style.backgroundPosition = "0" + "%" + " " + frameHeight*rangeValue + "%"; //get background position in percentage

        if (rangeValue == 59) {
            Elements.phoneWrapper.classList.add('invisible');
            Elements.phoneInternals.classList.add('visible');
        } else {
            Elements.phoneWrapper.classList.remove('invisible');
            Elements.phoneInternals.classList.remove('visible');
        }
    };

    //text constructor

    class textChange {
        constructor() {
            this.textArray = Elements.textArray;
        }

        toggleActiveText(position) {
            console.log(this.textArray);
            for (let i = 0; i < this.textArray.length; i++) {
                this.textArray[i].classList.remove('active');
            }
                this.textArray[position].classList.add('active');
        }
    }

    // function that changes text

    const toggleText = (rangeValue) => {
        if (rangeValue == 0 && rangeValue < 15) {
            text.toggleActiveText(0);
                } else if (rangeValue > 14 && rangeValue < 29) {
            text.toggleActiveText(1);
                } else if (rangeValue > 28 && rangeValue < 44) {
            text.toggleActiveText(2);
                } else if (rangeValue > 43) {
            text.toggleActiveText(3);
                }
    };

    //function that hides and shows video

    const hideVideo = (rangeValue) => {
        if (rangeValue > 2) {
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

            for ( let i = 1; i < randomNumber( 40, 80 ); i++ ) {
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

    const closeWidget = () => {
        Elements.closeWidgetIcon.addEventListener('click', (e) => {
            e.preventDefault();
            Elements.widgetWrapper.classList.add('hidden');
            Elements.phoneVideoWrapper.classList.add('hidden');
            Elements.phoneVideoWrapper.pause();
            setTimeout(() => {
                Elements.widgetWrapper.style.display = 'none';
            }, 500)
        }, false);
    };

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

    // class init

    const text = new textChange();
    const rains = new Rains();

    // initialize functions

    closeWidget();
    preLoad();

    Elements.inputRange.addEventListener('input', function (e) {
        let rangeValue = e.target.value;
        toggleText(rangeValue);
        changePhoneBackground(rangeValue);
        hideVideo(rangeValue);
        showFlash(rangeValue);
        rainDropsShow(rangeValue);
    }, false);

};

