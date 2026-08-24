window.App = {

    started: false,


    async initialize() {

        console.log(
            "========================"
        );

        console.log(
            "SPIDER-AI V2"
        );

        console.log(
            "INITIALIZING"
        );

        console.log(
            "========================"
        );


        const camera =
            document.getElementById(
                "camera"
            );


        Distance.initialize();

        Voice.initialize();

        SpiderAI.initialize();


        HUD.setSystemStatus(
            "READY"
        );

        HUD.setCameraStatus(
            "OFF"
        );

        HUD.setAIStatus(
            "READY"
        );

        HUD.setTarget(
            "SYSTEM READY"
        );


        console.log(
            "APP: ready"
        );

    },


    async start() {

        if (this.started) {
            return;
        }


        const button =
            document.getElementById(
                "startButton"
            );


        button.textContent =
            "STARTING...";


        HUD.setSystemStatus(
            "STARTING"
        );


        try {

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices
                    .getUserMedia
            ) {

                throw new Error(
                    "Camera API unavailable"
                );

            }


            const stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({

                        video: {

                            facingMode:
                                {
                                    ideal:
                                        "environment"
                                }

                        },

                        audio: false

                    });


            const camera =
                document.getElementById(
                    "camera"
                );


            camera.srcObject =
                stream;


            await camera.play();


            HUD.setCameraStatus(
                "ON"
            );


            HUD.setSystemStatus(
                "ONLINE"
            );


            /*
             * Load the actual AI.
             */

            const modelReady =
                await Vision.initialize(
                    camera
                );


            if (!modelReady) {

                button.textContent =
                    "AI MODEL ERROR";

                return;

            }


            /*
             * Start AI vision.
             */

            Vision.start();


            this.started = true;


            button.textContent =
                "SPIDER-AI ACTIVE";


            HUD.setTarget(
                "SCANNING"
            );


            console.log(
                "SPIDER-AI ACTIVE"
            );


        } catch (error) {

            console.error(
                "SPIDER-AI START ERROR:",
                error
            );


            HUD.setSystemStatus(
                "ERROR"
            );


            HUD.setTarget(
                "START ERROR"
            );


            button.textContent =
                "TRY AGAIN";

        }

    },


    stop() {

        const camera =
            document.getElementById(
                "camera"
            );


        if (camera.srcObject) {

            camera.srcObject
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );

        }


        camera.srcObject =
            null;


        Vision.stop();


        this.started =
            false;


        HUD.setSystemStatus(
            "READY"
        );

        HUD.setCameraStatus(
            "OFF"
        );

        HUD.setAIStatus(
            "STANDBY"
        );

        HUD.setTarget(
            "SYSTEM READY"
        );


        document.getElementById(
            "startButton"
        ).textContent =
            "START SPIDER-AI";

    }

};


/* =========================================================
   BUTTON
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const button =
            document.getElementById(
                "startButton"
            );


        if (!button) {

            console.error(
                "APP: start button missing"
            );

            return;

        }


        button.addEventListener(
            "click",
            async () => {

                if (!App.started) {

                    await App.start();

                } else {

                    App.stop();

                }

            }
        );


        App.initialize();

    }
);
