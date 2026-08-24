window.Voice = {

    recognition: null,

    available: false,

    initialize() {

        const Recognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (Recognition) {

            this.recognition =
                new Recognition();

            this.recognition.lang =
                "en-US";

            this.recognition.continuous =
                false;

            this.recognition.interimResults =
                false;


            this.recognition.onstart =
                () => {

                    HUD.setVoiceStatus(
                        "LISTENING"
                    );

                };


            this.recognition.onend =
                () => {

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

                    const command =
                        result[0]
                            .transcript
                            .trim();


                    SpiderAI.handleCommand(
                        command
                    );

                };


            this.recognition.onerror =
                error => {

                    console.log(
                        "VOICE ERROR:",
                        error.error
                    );

                    HUD.setVoiceStatus(
                        "ERROR"
                    );

                };


            this.available = true;

        }


        HUD.setVoiceStatus(
            this.available
                ? "READY"
                : "UNAVAILABLE"
        );


        console.log(
            "VOICE: loaded"
        );

    },


    listen() {

        if (!this.recognition) {
            return;
        }


        try {

            this.recognition.start();

        } catch (error) {

            console.log(
                "VOICE START:",
                error
            );

        }

    },


    speak(text) {

        if (
            !("speechSynthesis" in window)
        ) {
            return;
        }


        window.speechSynthesis.cancel();


        const message =
            new SpeechSynthesisUtterance(
                text
            );


        message.rate =
            SPIDER_CONFIG.voice.rate;

        message.pitch =
            SPIDER_CONFIG.voice.pitch;


        window.speechSynthesis.speak(
            message
        );

    },


    handleCommand(command) {

        SpiderAI.handleCommand(
            command
        );

    }

};

console.log("VOICE: loaded");
