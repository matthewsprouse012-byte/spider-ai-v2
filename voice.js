/* =========================================================
   SPIDER-AI V2
   VOICE SYSTEM
========================================================= */

const Voice = {

    recognition: null,

    available: false,

    listening: false,


    initialize() {

        /*
         * Speech output
         */

        const speechAvailable =
            "speechSynthesis" in window;


        /*
         * Speech recognition varies by browser.
         */

        const Recognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (Recognition) {

            this.recognition =
                new Recognition();

            this.recognition.continuous = false;

            this.recognition.interimResults = false;

            this.recognition.lang = "en-US";


            this.recognition.onstart = () => {

                this.listening = true;

                HUD.setVoiceStatus(
                    "LISTENING"
                );

            };


            this.recognition.onend = () => {

                this.listening = false;

                HUD.setVoiceStatus(
                    "READY"
                );

            };


            this.recognition.onerror =
                (event) => {

                    console.log(
                        "Voice recognition:",
                        event.error
                    );

                    this.listening = false;

                    HUD.setVoiceStatus(
                        "ERROR"
                    );

                };


            this.recognition.onresult =
                (event) => {

                    const result =
                        event.results[
                            event.results.length - 1
                        ];


                    const text =
                        result[0].transcript
                            .trim();


                    console.log(
                        "Voice command:",
                        text
                    );


                    /*
                     * AI command handling will
                     * be connected later.
                     */

                    this.handleCommand(text);

                };


            this.available = true;

        }


        if (speechAvailable) {

            HUD.setVoiceStatus(
                "READY"
            );

        } else {

            HUD.setVoiceStatus(
                "UNAVAILABLE"
            );

        }

    },


    startListening() {

        if (!this.recognition) {

            HUD.setVoiceStatus(
                "NOT SUPPORTED"
            );

            return;

        }


        if (this.listening) {

            return;

        }


        try {

            this.recognition.start();

        }

        catch (error) {

            console.log(
                "Voice start error:",
                error
            );

        }

    },


    stopListening() {

        if (!this.recognition) {
            return;
        }


        try {

            this.recognition.stop();

        }

        catch (error) {

            console.log(
                "Voice stop error:",
                error
            );

        }

    },


    speak(text) {

        if (!("speechSynthesis" in window)) {

            return;

        }


        window.speechSynthesis.cancel();


        const message =
            new SpeechSynthesisUtterance(
                text
            );


        message.rate =
            SPIDER_CONFIG.voice.speechRate;


        message.pitch =
            SPIDER_CONFIG.voice.speechPitch;


        window.speechSynthesis.speak(
            message
        );

    },


    handleCommand(command) {

        const text =
            command.toLowerCase();


        /*
         * Basic commands for testing.
         * The AI system will eventually
         * handle more advanced requests.
         */

        if (
            text.includes("hello") ||
            text.includes("hi")
        ) {

            this.speak(
                "Spider AI online."
            );

            return;
        }


        if (
            text.includes("status")
        ) {

            this.speak(
                "Spider AI system online."
            );

            return;
        }


        if (
            text.includes("camera")
        ) {

            this.speak(
                "Camera system is active."
            );

            return;
        }


        this.speak(
            "I heard you say " + command
        );

    }

};
