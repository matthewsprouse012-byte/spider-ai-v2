window.Voice = {

    recognition: null,

    available: false,

    listening: false,


    initialize() {

        const Recognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!Recognition) {

            console.warn(
                "VOICE: speech recognition unavailable"
            );

            HUD.setVoiceStatus(
                "UNAVAILABLE"
            );

            return;

        }


        this.recognition =
            new Recognition();


        this.recognition.lang =
            "en-US";


        this.recognition.continuous =
            false;


        this.recognition.interimResults =
            false;


        this.recognition.maxAlternatives =
            1;


        this.recognition.onstart =
            () => {

                this.listening = true;

                HUD.setVoiceStatus(
                    "LISTENING"
                );

            };


        this.recognition.onend =
            () => {

                this.listening = false;

                HUD.setVoiceStatus(
                    "READY"
                );

            };


        this.recognition.onresult =
            event => {

                const result =
                    event.results[
                        event.results.length - 1
                    ];


                const transcript =
                    result[0]
                        .transcript
                        .trim();


                console.log(
                    "YOU:",
                    transcript
                );


                HUD.setVoiceStatus(
                    "PROCESSING"
                );


                SpiderAI.handleCommand(
                    transcript
                );

            };


        this.recognition.onerror =
            error => {

                this.listening = false;

                console.warn(
                    "VOICE ERROR:",
                    error.error
                );


                HUD.setVoiceStatus(
                    "READY"
                );

            };


        this.available = true;


        HUD.setVoiceStatus(
            "READY"
        );


        console.log(
            "VOICE V2.1: ready"
        );

    },


    listen() {

        if (
            !this.available ||
            !this.recognition
        ) {

            Voice.speak(
                "Voice control is not available in this browser."
            );

            return;

        }


        if (this.listening) {
            return;
        }


        try {

            this.recognition.start();

        } catch (error) {

            console.warn(
                "VOICE START ERROR:",
                error
            );

        }

    },


    stopListening() {

        if (
            this.recognition &&
            this.listening
        ) {

            this.recognition.stop();

        }

    },


    speak(text) {

        if (
            !text ||
            !("speechSynthesis" in window)
        ) {

            return;

        }


        console.log(
            "SPIDER-AI:",
            text
        );


        window.speechSynthesis.cancel();


        const message =
            new SpeechSynthesisUtterance(
                text
            );


        message.lang =
            "en-US";


        message.rate =
            1.0;


        message.pitch =
            1.0;


        message.volume =
            1.0;


        message.onstart =
            () => {

                HUD.setVoiceStatus(
                    "SPEAKING"
                );

            };


        message.onend =
            () => {

                HUD.setVoiceStatus(
                    "READY"
                );

            };


        message.onerror =
            () => {

                HUD.setVoiceStatus(
                    "READY"
                );

            };


        window.speechSynthesis.speak(
            message
        );

    }

};

console.log(
    "VOICE V2.1: loaded"
);
