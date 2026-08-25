console.log("SPIDER-AI APP.JS LOADED");

window.App = {

    started: false,
    cameraStream: null,

    // ==========================================
    // INITIALIZE
    // ==========================================

    initialize() {

        console.log("APP: initialize()");

        const button =
            document.getElementById("startButton");

        const camera =
            document.getElementById("camera");


        if (!button) {

            console.error(
                "APP: startButton NOT FOUND"
            );

            return;
        }


        if (!camera) {

            console.error(
                "APP: camera NOT FOUND"
            );

            return;
        }


        // Initialize systems if available

        if (window.Distance) {

            try {
                Distance.initialize();
            } catch (error) {

                console.warn(
                    "Distance initialization failed:",
                    error
                );

            }

        }


        if (window.SpiderAI) {

            try {
                SpiderAI.initialize();
            } catch (error) {

                console.warn(
                    "AI initialization failed:",
                    error
                );

            }

        }


        if (window.Vision) {

            try {
                Vision.initialize(camera);
            } catch (error) {

                console.warn(
                    "Vision initialization failed:",
                    error
                );

            }

        }


        // Initial HUD

        if (window.HUD) {

            HUD.setSystemStatus("READY");
            HUD.setCameraStatus("OFF");
            HUD.setAIStatus("STANDBY");
            HUD.setModelStatus("OFF");
            HUD.setTrackStatus("OFF");
            HUD.setTarget("SYSTEM READY");

        }


        // ==========================================
        // BUTTON CONNECTION
        // ==========================================

        button.onclick = async () => {

            console.log(
                "START BUTTON FIRED"
            );


            if (App.started) {

                App.stop();

            } else {

                await App.start();

            }

        };


        console.log(
            "APP: button connected"
        );


        // Battery

        App.updateBattery();

    },


    // ==========================================
    // START
    // ==========================================

    async start() {

        console.log(
            "APP: start()"
        );


        const button =
            document.getElementById(
                "startButton"
            );

        const camera =
            document.getElementById(
                "camera"
            );


        if (!button) {

            console.error(
                "APP: button missing"
            );

            return;

        }


        if (!camera) {

            console.error(
                "APP: camera missing"
            );

            return;

        }


        try {

            button.disabled = true;

            button.textContent =
                "STARTING...";


            if (window.HUD) {

                HUD.setSystemStatus(
                    "STARTING"
                );

                HUD.setTarget(
                    "STARTING CAMERA"
                );

            }


            console.log(
                "APP: requesting camera"
            );


            // ==========================================
            // CAMERA
            // ==========================================

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                throw new Error(
                    "Camera API unavailable"
                );

            }


            this.cameraStream =
                await navigator.mediaDevices
                    .getUserMedia({

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


            console.log(
                "APP: camera permission granted"
            );


            camera.srcObject =
                this.cameraStream;


            await new Promise(
                (resolve, reject) => {

                    const timeout =
                        setTimeout(
                            () => {

                                reject(
                                    new Error(
                                        "Camera timeout"
                                    )
                                );

                            },
                            10000
                        );


                    if (
                        camera.readyState >= 2
                    ) {

                        clearTimeout(
                            timeout
                        );

                        resolve();

                        return;

                    }


                    camera.onloadedmetadata =
                        () => {

                            clearTimeout(
                                timeout
                            );

                            resolve();

                        };

                }
            );


            await camera.play();


            console.log(
                "APP: camera playing"
            );


            if (window.HUD) {

                HUD.setCameraStatus(
                    "ON"
                );

                HUD.setTarget(
                    "CAMERA ONLINE"
                );

            }


            // ==========================================
            // CHECK VISION
            // ==========================================

            if (!window.Vision) {

                throw new Error(
                    "Vision.js is not loaded"
                );

            }


            console.log(
                "APP: Vision system found"
            );


            // ==========================================
            // LOAD AI MODEL
            // ==========================================

            if (window.HUD) {

                HUD.setAIStatus(
                    "LOADING"
                );

                HUD.setModelStatus(
                    "LOADING"
                );

                HUD.setTarget(
                    "LOADING AI MODEL"
                );

            }


            console.log(
                "APP: loading COCO-SSD"
            );


            const ready =
                await Vision.loadModel();


            if (!ready) {

                throw new Error(
                    "AI model failed to load"
                );

            }


            console.log(
                "APP: AI MODEL READY"
            );


            if (window.HUD) {

                HUD.setModelStatus(
                    "READY"
                );

                HUD.setAIStatus(
                    "ONLINE"
                );

            }


            // ==========================================
            // START VISION
            // ==========================================

            console.log(
                "APP: starting vision"
            );


            Vision.start();


            this.started = true;


            if (window.HUD) {

                HUD.setSystemStatus(
                    "ONLINE"
                );

                HUD.setTrackStatus(
                    "SEARCHING"
                );

                HUD.setTarget(
                    "SCANNING"
                );

            }


            button.disabled = false;

            button.textContent =
                "STOP SPIDER-AI";


            console.log(
                "SPIDER-AI ACTIVE"
            );


        } catch (error) {

            console.error(
                "SPIDER-AI START FAILED:",
                error
            );


            this.started = false;


            // Stop camera if startup failed

            if (this.cameraStream) {

                this.cameraStream
                    .getTracks()
                    .forEach(
                        track => track.stop()
                    );

                this.cameraStream = null;

            }


            camera.srcObject =
                null;


            if (window.HUD) {

                HUD.setSystemStatus(
                    "ERROR"
                );

                HUD.setCameraStatus(
                    "OFF"
                );

                HUD.setAIStatus(
                    "ERROR"
                );

                HUD.setTarget(
                    "START FAILED"
                );

            }


            button.disabled = false;

            button.textContent =
                "TRY AGAIN";

        }

    },


    // ==========================================
    // STOP
    // ==========================================

    stop() {

        console.log(
            "APP: stopping"
        );


        if (window.Vision) {

            try {
                Vision.stop();
            } catch (error) {

                console.warn(
                    "Vision stop warning:",
                    error
                );

            }

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
            document.getElementById(
                "camera"
            );


        if (camera) {

            camera.pause();

            camera.srcObject =
                null;

        }


        this.started = false;


        if (window.HUD) {

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

            HUD.setObjectCount(
                0
            );

            HUD.setScanRate(
                0
            );

            HUD.setObject(
                "NONE",
                0
            );

            HUD.setTarget(
                "SYSTEM READY"
            );

            HUD.hideDetection();

        }


        const button =
            document.getElementById(
                "startButton"
            );


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "START SPIDER-AI";

        }


        console.log(
            "APP: stopped"
        );

    },


    // ==========================================
    // BATTERY
    // ==========================================

    async updateBattery() {

        if (
            !navigator.getBattery
        ) {

            console.log(
                "APP: battery API unavailable"
            );

            if (window.HUD) {
                HUD.setBattery(null);
            }

            return;

        }


        try {

            const battery =
                await navigator.getBattery();


            const update =
                () => {

                    if (window.HUD) {

                        HUD.setBattery(
                            battery.level * 100
                        );

                    }

                };


            update();


            battery.addEventListener(
                "levelchange",
                update
            );


        } catch (error) {

            console.warn(
                "APP: battery unavailable",
                error
            );

            if (window.HUD) {
                HUD.setBattery(null);
            }

        }

    }

};


// ==========================================
// PAGE LOAD
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "APP: DOM CONTENT LOADED"
        );


        App.initialize();

    }
);
