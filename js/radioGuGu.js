radio = {
    
    isSpeaking: false,
    currentVolume: 100,
    targetVolume: 40,
    saying: null,
    birdsCount: 1,
    isJingle: false,

    init: function() {
        //utils.log('ready');
        setInterval(function() {
            var d = new Date();
            var v = Math.sin(d.getTime()/25000)/2+0.5;
            $('#birds').get(0).volume=v;

            v = Math.sin(d.getTime()/32127)/2+0.5;
            $('#rain').get(0).volume=v*0.8;


        }, 1000);

        $('#jingle').get(0).volume=0;

    },

    fadeSound: function(targetVolume, step) {

        //  decrease the current volume
        if (targetVolume < radio.currentVolume) {
            radio.currentVolume--;
        } else {
            radio.currentVolume++;
        }
        
        $('#drone').get(0).volume=(radio.currentVolume/100);
        if (radio.isJingle) {
            $('#jingle').get(0).volume=(1-(radio.currentVolume/100))/4;
        }

        //  if we have reached the targetVolume then we are done
        if (radio.currentVolume == targetVolume) {
            radio.fadeFinished();
            return;
        }

        //  otherwise we're going to want to call this function again
        //  but we have to work out when, if we wanted to drop from 100
        //  to 40 (i.e. 60 units) in 2000ms, then we shoudl call this
        //  again in 2000/60 ms
        setTimeout(function() {radio.fadeSound(targetVolume, step);}, step);

    },

    say: function(msg, params) {
        this.saying = msg;

        this.isJingle = false;
        if ('is' in params && params.is == 'jingle') {
            this.isJingle = true;
        } else {
            this.sayingParams = params;
        }
        radio.fadeSound(20, 2000/Math.abs(radio.currentVolume - 20));
    },

    fadeFinished: function() {
        //utils.log('finished fade');
        //  If we are supposed to be saying something, do it now
        if (this.saying !== null) {
            try {
                if (this.isJingle) {
                    speak(radio.saying, radio.params);
                } else {
                    $('#HiDeHi').get(0).play();
                    setTimeout(function() {speak(radio.saying, radio.params);}, 2500);
                }
            } catch(er) {
                radio.speakEnded();
            }
        } else {
            control.finishBroadcast();
        }
    },

    speakEnded: function() {

        this.saying = null;
        if (this.isJingle) {
            setTimeout(function() {radio.fadeSound(100, 2000/Math.abs(radio.currentVolume - 100));}, 2000);
        } else {
            radio.fadeSound(100, 2000/Math.abs(radio.currentVolume - 100));
        }

    }

};