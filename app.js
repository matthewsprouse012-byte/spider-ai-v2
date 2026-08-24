/* =========================================================
   SPIDER-AI V2
   MAIN APPLICATION CONTROLLER
========================================================= */

const App = {

    started: false,


    /* =====================================================
       INITIALIZE
    ===================================================== */

    initialize() {

        console.log("SPIDER-AI V2 starting...");


        // Connect the camera to the vision system.

        Vision.initialize(
            document.getElementById("camera")
        );


        // Initialize the distance system.

        Distance.initialize();


        // Initialize voice.

        Voice.initialize();


        // Initialize the AI brain.

        SpiderAI.initialize();


        // Show initial system state.

        HUD.setSystemStatus("READY");

        HUD.setCameraStatus("OFF");

        HUD.setAIStatus("ONLINE");

        HUD.setDepthStatus("OFF");

        HUD.setTarget("SYSTEM READY");


        console.log(
            "SPIDER-AI V2 initialized."
        );

    },


    /* =====================================================
       START SYSTEM
    ===================================================== */

    async start() {

        if (this.started) {
            return;
        }


        HUD.setSystemStatus(
            "STARTING"
        );


        HUD.setTarget(
            "STARTING SYSTEM"
        );


        // Start the phone camera.

        const cameraStarted =
            await this.startCamera();


        if (!cameraStarted) {

            HUD.setSystemStatus(
                "CAMERA ERROR"
            );

            HUD.setTarget(
                "CAMERA FAILED"
            );

            return;

        }


        // Start the vision pipeline.

        Vision.start();


        // System is now running.

        this.started = true;


        HUD.setSystemStatus(
            "ONLINE"
        );


        HUD.setCameraStatus(
            "ON"
        );


        HUD.setAIStatus(
            "READY"
        );


        HUD.setTarget(
            "VISION READY"
        );


        document.getElementById(
            "startButton"
        ).textContent =
            "SPIDER-AI ACTIVE";


        console.log(
            "SPIDER-AI is online."
        );

    },


    /* =====================================================
       CAMERA
    ===================================================== */

    async startCamera() {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            console.error(
                "Camera API unavailable."
            );

            return false;

        }


        try {

            const stream =
                await navigator.mediaDevices
                    .getUserMedia({

                        video: {

                            facingMode: {
                                ideal:
                                    SPIDER_CONFIG
                                        .camera
                                        .preferredFacingMode
                            }

                        },

                        audio:
                            SPIDER_CONFIG
                                .camera
                                .audio

                    });


            const camera =
                document.getElementById(
                    "camera"
                );


            camera.srcObject =
                stream;


            await camera.play();


            return true;

        }

        catch (error) {

            console.error(
                "Camera error:",
                error
            );

            return false;

        }

    },


    /* =====================================================
       STOP SYSTEM
    ===================================================== */

    stop() {

        const camera =
            document.getElementById(
                "camera"
            );


        if (camera.srcObject) {

            camera.srcObject
                .getTracks()
                .forEach(
                    track => track.stop()
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
   START BUTTON
========================================================= */

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        async () => {

            if (!App.started) {

                await App.start();

            }

            else {

                App.stop();

            }

        }
    );


/* =========================================================
   STARTUP
========================================================= */

App.initialize();
