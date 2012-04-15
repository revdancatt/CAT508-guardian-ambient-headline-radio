radio = {
    
    isSpeaking: false,
    currentVolume: 100,
    targetVolume: 40,
    saying: null,
    birdsCount: 1,

    init: function() {
        //utils.log('ready');
        setInterval(function() {
            var d = new Date();
            var v = Math.sin(d.getTime()/25000)/2+0.5;
            $('#birds').get(0).volume=v;

            v = Math.sin(d.getTime()/32127)/2+0.5;
            $('#rain').get(0).volume=v*0.8;


        }, 1000);
    },

    fadeSound: function(targetVolume, step) {

        //  decrease the current volume
        if (targetVolume < radio.currentVolume) {
            radio.currentVolume--;
        } else {
            radio.currentVolume++;
        }
        
        $('#drone').get(0).volume=(radio.currentVolume/100);

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
        this.sayingParams = params;
        radio.fadeSound(20, 2000/Math.abs(radio.currentVolume - 20));
    },

    fadeFinished: function() {
        //utils.log('finished fade');
        //  If we are supposed to be saying something, do it now
        if (this.saying !== null) {
            try {
                speak(this.saying, this.params);
            } catch(er) {
                radio.speakEnded();
            }
        } else {
            control.finishBroadcast();
        }
    },

    speakEnded: function() {

        this.saying = null;
        radio.fadeSound(100, 2000/Math.abs(radio.currentVolume - 100));

    }

};