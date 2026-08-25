console.log("SPIDER-AI APP.JS LOADED");

window.App = {

    started: false,
    cameraStream: null,

    initialize: function () {

        console.log("APP: DOM CONTENT LOADED");
        console.log("APP: initialize()");

        var button =
            document.getElementById("startButton");

        var camera =
            document.getElementById("camera");


        if (!button) {
            console.error("APP: startButton NOT FOUND");
            return;
        }

        if (!camera) {
            console.error("APP: camera NOT FOUND");
            return;
        }


        // ------------------------------------------
        // Initialize systems
        // ------------------------------------------

        if (window.Distance) {

            try {
                window.Distance.initialize();
            } catch (error) {
                console.warn(
                    "Distance initialization warning:",
                    error
                );
            }

        }


        if (window.SpiderAI) {

            try {
                window.SpiderAI.initialize();
            } catch (error) {
                console.warn(
                    "AI initialization warning:",
                    error
                );
            }

        }


        if (window.Vision) {

            try {
                window.Vision.initialize(camera);
            } catch (error) {
                console.warn(
                    "Vision initialization warning:",
                    error
                );
            }

        }


        // ------------------------------------------
        // Initial HUD
        // ------------------------------------------

        if (window.HUD) {

            HUD.setSystemStatus("READY");
            HUD.setCameraStatus("OFF");
            HUD.setAIStatus("STANDBY");
            HUD.setModelStatus("OFF");
            HUD.setTrackStatus("OFF");
            HUD.setObjectCount(0);
            HUD.setScanRate(0);
            HUD.setTarget("SYSTEM READY");

        }


        // ------------------------------------------
        // Connect button
        // ------------------------------------------

        button.onclick = function () {

            console.log("START BUTTON FIRED");

            if (App.started) {

                App.stop();

            } else {

                App.start();

            }

        };


        console.log(
            "APP: button connected"
        );


        App.updateBattery();

    },


    // ==========================================
    // START SPIDER AI
    // ==========================================

    start: async function () {

        console.log("APP: start()");


        var button =
            document.getElementById("startButton");

        var camera =
            document.getElementById("camera");


        if (!button || !camera) {

            console.error(
                "APP: required elements missing"
            );

            return;

        }


        try {

            button.disabled = true;
            button.textContent = "STARTING...";


            if (window.HUD) {

                HUD.setSystemStatus("STARTING");
                HUD.setTarget("STARTING CAMERA");

            }


            // ------------------------------------------
            // Camera support check
            // ------------------------------------------

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                throw new Error(
                    "Camera API is unavailable."
                );

            }


            console.log(
                "APP: requesting camera"
            );


            // ------------------------------------------
            // Camera
            // ------------------------------------------

            App.cameraStream =
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
                App.cameraStream;


            await new Promise(
                function (resolve, reject) {

                    var timeout =
                        setTimeout(
                            function () {

                                reject(
                                    new Error(
                                        "Camera startup timed out."
                                    )
                                );

                            },
                            10000
                        );


                    if (
                        camera.readyState >= 2
                    ) {

                        clearTimeout(timeout);

                        resolve();

                        return;

                    }


                    camera.onloadedmetadata =
                        function () {

                            clearTimeout(timeout);

                            resolve();

                        };

                }
            );


            await camera.play();


            console.log(
                "APP: camera playing"
            );


            if (window.HUD) {

                HUD.setCameraStatus("ON");
                HUD.setTarget("CAMERA ONLINE");

            }


            // ------------------------------------------
            // Vision system
            // ------------------------------------------

            if (!window.Vision) {

                throw new Error(
                    "vision.js was not loaded."
                );

            }


            console.log(
                "APP: Vision system found"
            );


            if (window.HUD) {

                HUD.setAIStatus("LOADING");
                HUD.setModelStatus("LOADING");
                HUD.setTarget("LOADING AI MODEL");

            }


            console.log(
                "APP: loading AI model"
            );


            var modelReady =
                await window.Vision.loadModel();


            if (!modelReady) {

                throw new Error(
                    "AI model failed to load."
                );

            }


            console.log(
                "APP: AI MODEL READY"
            );


            if (window.HUD) {

                HUD.setModelStatus("READY");
                HUD.setAIStatus("ONLINE");

            }


            // ------------------------------------------
            // Start scanning
            // ------------------------------------------

            console.log(
                "APP: starting scanner"
            );


            window.Vision.start();


            App.started = true;


            if (window.HUD) {

                HUD.setSystemStatus("ONLINE");
                HUD.setTrackStatus("SEARCHING");
                HUD.setTarget("SCANNING");

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


            App.started = false;


            // Stop camera if startup failed

            if (App.cameraStream) {

                App.cameraStream
                    .getTracks()
                    .forEach(
                        function (track) {
                            track.stop();
                        }
                    );

                App.cameraStream = null;

            }


            camera.srcObject = null;


            if (window.HUD) {

                HUD.setSystemStatus("ERROR");
                HUD.setCameraStatus("OFF");
                HUD.setAIStatus("ERROR");

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

    stop: function () {

        console.log(
            "APP: stopping"
        );


        if (window.Vision) {

            try {

                window.Vision.stop();

            } catch (error) {

                console.warn(
                    "Vision stop warning:",
                    error
                );

            }

        }


        if (App.cameraStream) {

            App.cameraStream
                .getTracks()
                .forEach(
                    function (track) {
                        track.stop();
                    }
                );

            App.cameraStream = null;

        }


        var camera =
            document.getElementById("camera");


        if (camera) {

            camera.pause();

            camera.srcObject = null;

        }


        App.started = false;


        if (window.HUD) {

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

        }


        var button =
            document.getElementById(
                "startButton"
            );


        if (button) {

            button.disabled = false;

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

    updateBattery: async function () {

        if (
            !navigator.getBattery
        ) {

            if (window.HUD) {
                HUD.setBattery(null);
            }

            return;

        }


        try {

            var battery =
                await navigator.getBattery();


            function update() {

                if (window.HUD) {

                    HUD.setBattery(
                        battery.level * 100
                    );

                }

            }


            update();


            battery.addEventListener(
                "levelchange",
                update
            );


        } catch (error) {

            console.warn(
                "Battery unavailable:",
                error
            );

            if (window.HUD) {
                HUD.setBattery(null);
            }

        }

    }

};


// ==========================================
// PAGE READY
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "APP: DOM CONTENT LOADED"
        );

        window.App.initialize();

    }
);
