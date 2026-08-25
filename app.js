window.App = {

    started: false,
    cameraStream: null,

    async initialize() {

        console.log("================================");
        console.log("SPIDER-AI V2.2");
        console.log("INITIALIZING VISION SYSTEM");
        console.log("================================");

        const camera =
            document.getElementById("camera");

        if (!camera) {
            console.error("APP: camera element missing");
            return;
        }

        // Initialize supporting systems
        if (window.Distance) {
            Distance.initialize();
        }

        if (window.SpiderAI) {
            SpiderAI.initialize();
        }

        if (window.Vision) {
            Vision.initialize(camera);
        }

        HUD.setSystemStatus("READY");
        HUD.setCameraStatus("OFF");
        HUD.setAIStatus("STANDBY");
        HUD.setModelStatus("OFF");
        HUD.setTrackStatus("OFF");
        HUD.setTarget("SYSTEM READY");

        this.updateBattery();

        console.log("APP: initialization complete");
    },


    async start() {

        if (this.started) {
            return;
        }

        const button =
            document.getElementById("startButton");

        const camera =
            document.getElementById("camera");

        if (!camera) {
            console.error("APP: camera missing");
            return;
        }

        try {

            if (button) {
                button.disabled = true;
                button.textContent = "STARTING...";
            }

            HUD.setSystemStatus("STARTING");
            HUD.setTarget("STARTING CAMERA");


            // ==========================================
            // CAMERA
            // ==========================================

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                throw new Error(
                    "Camera access is not supported by this browser."
                );
            }


            this.cameraStream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: {
                            ideal: "environment"
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


            camera.srcObject =
                this.cameraStream;


            await new Promise(
                resolve => {

                    if (
                        camera.readyState >= 2
                    ) {
                        resolve();
                        return;
                    }

                    camera.onloadedmetadata =
                        () => resolve();

                }
            );


            await camera.play();


            HUD.setCameraStatus("ON");
            HUD.setTarget("CAMERA ONLINE");


            console.log(
                "APP: camera online"
            );


            // ==========================================
            // VISION MODEL
            // ==========================================

            HUD.setAIStatus("LOADING");
            HUD.setModelStatus("LOADING");
            HUD.setTarget("LOADING AI MODEL");


            if (
                !window.Vision
            ) {
                throw new Error(
                    "Vision system is missing."
                );
            }


            const modelReady =
                await Vision.loadModel();


            if (!modelReady) {

                throw new Error(
                    "COCO-SSD failed to load."
                );

            }


            HUD.setModelStatus("READY");
            HUD.setAIStatus("ONLINE");


            console.log(
                "APP: AI model ready"
            );


            // ==========================================
            // START SCANNING
            // ==========================================

            Vision.start();


            this.started = true;


            HUD.setSystemStatus("ONLINE");
            HUD.setTarget("SCANNING");
            HUD.setTrackStatus("SEARCHING");


            if (button) {

                button.disabled = false;

                button.textContent =
                    "STOP SPIDER-AI";

            }


            console.log(
                "SPIDER-AI ACTIVE"
            );


        } catch (error) {

            console.error(
                "SPIDER-AI START ERROR:",
                error
            );


            this.started = false;


            if (this.cameraStream) {

                this.cameraStream
                    .getTracks()
                    .forEach(
                        track => track.stop()
                    );

                this.cameraStream = null;

            }


            camera.srcObject = null;


            HUD.setSystemStatus("ERROR");
            HUD.setAIStatus("ERROR");
            HUD.setTarget("START FAILED");


            if (button) {

                button.disabled = false;

                button.textContent =
                    "TRY AGAIN";

            }

        }

    },


    stop() {

        console.log(
            "SPIDER-AI: stopping"
        );


        if (window.Vision) {
            Vision.stop();
        }


        if (this.cameraStream) {

            this.cameraStream
                .getTracks()
                .forEach(
                    track => track.stop()
                );

            this.cameraStream = null;

        }


        const camera =
            document.getElementById("camera");


        if (camera) {
            camera.srcObject = null;
        }


        this.started = false;


        HUD.setSystemStatus("READY");
        HUD.setCameraStatus("OFF");
        HUD.setAIStatus("STANDBY");
        HUD.setModelStatus("OFF");
        HUD.setTrackStatus("OFF");
        HUD.setObjectCount(0);
        HUD.setScanRate(0);
        HUD.setObject("NONE", 0);
        HUD.setTarget("SYSTEM READY");
        HUD.hideDetection();


        const button =
            document.getElementById(
                "startButton"
            );


        if (button) {

            button.disabled = false;

            button.textContent =
                "START SPIDER-AI";

        }

    },


    async updateBattery() {

        const batteryElement =
            document.getElementById(
                "battery"
            );


        if (!batteryElement) {
            return;
        }


        if (
            !navigator.getBattery
        ) {

            batteryElement.textContent =
                "--";

            return;

        }


        try {

            const battery =
                await navigator.getBattery();


            const update =
                () => {

                    const level =
                        Math.round(
                            battery.level * 100
                        );

                    HUD.setBattery(level);

                };


            update();


            battery.addEventListener(
                "levelchange",
                update
            );


        } catch (error) {

            console.warn(
                "Battery information unavailable."
            );

            HUD.setBattery(null);

        }

    }

};


// ==============================================
// PAGE START
// ==============================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const button =
            document.getElementById(
                "startButton"
            );


        if (!button) {

            console.error(
                "APP: START BUTTON NOT FOUND"
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
