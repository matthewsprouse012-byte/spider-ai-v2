window.App = {

    started: false,


    async initialize() {

        console.log(
            "======================"
        );

        console.log(
            "SPIDER-AI V2.2"
        );

        console.log(
            "VISION SYSTEM"
        );

        console.log(
            "======================"
        );


        const camera =
            document.getElementById(
                "camera"
            );


        Distance.initialize();

        SpiderAI.initialize();

        Vision.initialize(
            camera
        );


        HUD.setSystemStatus(
            "READY"
        );

        HUD.setCameraStatus(
            "OFF"
        );

        HUD.setAIStatus(
            "STANDBY"
        );

        HUD.setModelStatus(
            "OFF"
        );

        HUD.setTrackStatus(
            "OFF"
        );

        HUD.setTarget(
            "SYSTEM READY"
        );


        this.updateBattery();

    },


    async start() {

        if (this.started) {
            return;
        }


        const button =
            document.getElementById(
                "startButton"
            );


        try {

            button.textContent =
                "STARTING...";


            HUD.setSystemStatus(
                "STARTING"
            );


            const stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({

                        video: {

                            facingMode:
                                {
                                    ideal:
                                        "environment"
                                },

                            width: {
                                ideal: 1280
                            },

                            height: {
                                ideal: 720
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
             * Load AI model.
             */

            const ready =
                await Vision.loadModel();


            if (!ready) {

                throw new Error(
                    "AI MODEL FAILED"
                );

            }


            Vision.start();


            this.started = true;


            button.textContent =
                "STOP SPIDER-AI";


            HUD.setTarget(
                "SCANNING"
            );


            console.log(
                "SPIDER-AI ONLINE"
            );


        } catch (error) {

            console.error(
                "START ERROR:",
                error
            );


            HUD.setSystemStatus(
                "ERROR"
            );


            HUD.setTarget(
                "START FAILED"
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


        if (
            camera &&
            camera.srcObject
        ) {

            camera.srcObject
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );

        }


        if (camera) {

            camera.srcObject =
                null;

        }


        Vision.stop();


        this.started = false;


        HUD.setSystemStatus(
            "READY"
        );

        HUD.setCameraStatus(
            "OFF"
        );

        HUD.setAIStatus(
            "STANDBY"
        );

        HUD.setModelStatus(
            "OFF"
        );

        HUD.setTrackStatus(
            "OFF"
        );

        HUD.setTarget(
            "SYSTEM READY"
        );


        document.getElementById(
            "startButton"
        ).textContent =
            "START SPIDER-AI";

    },


    async updateBattery() {

        if (
            !navigator.getBattery
        ) {

            HUD.setBattery(
                null
            );

            return;

        }


        try {

            const battery =
                await navigator
                    .getBattery();


            const update =
                () => {

                    HUD.setBattery(
                        battery.level *
                        100
                    );

                };


            update();


            battery.addEventListener(
                "levelchange",
                update
            );

        } catch (error) {

            console.log(
                "Battery unavailable"
            );

        }

    }

};


window.addEventListener(
    "DOMContentLoaded",
    () => {

        const button =
            document.getElementById(
                "startButton"
            );


        if (!button) {

            console.error(
                "START BUTTON MISSING"
            );

            return;

        }


        button.addEventListener(
            "click",
            async () => {

                if (
                    !App.started
                ) {

                    await App.start();

                } else {

                    App.stop();

                }

            }
        );


        App.initialize();

    }
);
