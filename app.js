/* =========================================================
   SPIDER-AI V2
   MAIN APPLICATION
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const camera = document.getElementById("camera");

const startButton = document.getElementById("startButton");

const systemStatus =
    document.getElementById("systemStatus");

const statusIndicator =
    document.getElementById("statusIndicator");

const cameraStatus =
    document.getElementById("cameraStatus");

const aiStatus =
    document.getElementById("aiStatus");

const depthStatus =
    document.getElementById("depthStatus");

const batteryDisplay =
    document.getElementById("battery");

const objectName =
    document.getElementById("objectName");

const confidence =
    document.getElementById("confidence");

const targetText =
    document.getElementById("targetText");

const distance =
    document.getElementById("distance");

const distanceMode =
    document.getElementById("distanceMode");

const voiceStatus =
    document.getElementById("voiceStatus");

const detectionBox =
    document.getElementById("detectionBox");

const detectionLabel =
    document.getElementById("detectionLabel");


/* =========================================================
   APPLICATION STATE
========================================================= */

const state = {

    cameraRunning: false,

    aiRunning: false,

    voiceAvailable: false,

    batteryAvailable: false

};


/* =========================================================
   INITIAL STATE
========================================================= */

function initializeSystem() {

    systemStatus.textContent = "READY";

    cameraStatus.textContent = "OFF";

    aiStatus.textContent = "STANDBY";

    depthStatus.textContent = "OFF";

    objectName.textContent = "STANDBY";

    confidence.textContent =
        "CONFIDENCE: --";

    distance.textContent = "--";

    distanceMode.textContent =
        "SENSOR: NOT CONNECTED";

    targetText.textContent =
        "SYSTEM READY";

}


/* =========================================================
   CAMERA
========================================================= */

async function startCamera() {

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        systemStatus.textContent =
            "CAMERA UNSUPPORTED";

        return;

    }


    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: {
                        ideal: "environment"
                    }

                },

                audio: false

            });


        camera.srcObject = stream;


        await camera.play();


        state.cameraRunning = true;


        cameraStatus.textContent = "ON";

        systemStatus.textContent = "ONLINE";

        targetText.textContent =
            "CAMERA ACTIVE";


        statusIndicator.style.background =
            "white";


        startButton.textContent =
            "SPIDER-AI ACTIVE";


        /*
         * The AI system will be connected
         * in the next stage.
         */

        aiStatus.textContent =
            "READY";


        /*
         * We do not claim that depth
         * is available.
         */

        depthStatus.textContent =
            "OFF";


    }

    catch (error) {

        console.error(
            "Camera error:",
            error
        );


        systemStatus.textContent =
            "CAMERA ERROR";


        cameraStatus.textContent =
            "ERROR";


        targetText.textContent =
            "CAMERA ACCESS FAILED";


        startButton.textContent =
            "TRY CAMERA AGAIN";

    }

}


/* =========================================================
   STOP CAMERA
========================================================= */

function stopCamera() {

    const stream =
        camera.srcObject;


    if (stream) {

        stream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

    }


    camera.srcObject = null;


    state.cameraRunning = false;


    cameraStatus.textContent =
        "OFF";


    systemStatus.textContent =
        "READY";


    targetText.textContent =
        "CAMERA OFF";


    startButton.textContent =
        "START SPIDER-AI";

}


/* =========================================================
   CAMERA BUTTON
========================================================= */

startButton.addEventListener(
    "click",
    async () => {

        if (!state.cameraRunning) {

            await startCamera();

        }

        else {

            stopCamera();

        }

    }
);


/* =========================================================
   BATTERY
========================================================= */

async function initializeBattery() {

    /*
     * Battery Manager is not available
     * in every mobile browser.
     */

    if (!("getBattery" in navigator)) {

        batteryDisplay.textContent =
            "--%";

        return;

    }


    try {

        const battery =
            await navigator.getBattery();


        state.batteryAvailable =
            true;


        function updateBattery() {

            const percentage =
                Math.round(
                    battery.level * 100
                );


            batteryDisplay.textContent =
                percentage + "%";

        }


        updateBattery();


        battery.addEventListener(
            "levelchange",
            updateBattery
        );


    }

    catch (error) {

        console.error(
            "Battery error:",
            error
        );

    }

}


/* =========================================================
   VOICE SUPPORT
========================================================= */

function initializeVoice() {

    if ("speechSynthesis" in window) {

        state.voiceAvailable =
            true;

        voiceStatus.textContent =
            "READY";

    }

    else {

        voiceStatus.textContent =
            "NOT AVAILABLE";

    }

}


/* =========================================================
   VOICE FUNCTION
========================================================= */

function speak(message) {

    if (!state.voiceAvailable) {

        return;

    }


    const speech =
        new SpeechSynthesisUtterance(
            message
        );


    speech.rate = 1;

    speech.pitch = 1;


    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
        speech
    );

}


/* =========================================================
   DEMO TARGET
========================================================= */

function showDemoTarget() {

    /*
     * This is only a visual test.
     *
     * It is NOT real AI detection.
     */

    detectionBox.classList.remove(
        "hidden"
    );


    detectionLabel.textContent =
        "VISION TEST";


    objectName.textContent =
        "VISION READY";


    confidence.textContent =
        "CONFIDENCE: TEST";


    targetText.textContent =
        "VISION SYSTEM READY";


    speak(
        "Spider AI vision system ready"
    );

}


/* =========================================================
   SYSTEM STARTUP
========================================================= */

initializeSystem();

initializeBattery();

initializeVoice();


/* =========================================================
   DEBUG MESSAGE
========================================================= */

console.log(
    "SPIDER-AI V2 initialized"
);
