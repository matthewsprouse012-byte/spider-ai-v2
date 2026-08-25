window.HUD = {

    // ==========================================
    // SYSTEM STATUS
    // ==========================================

    setSystemStatus(status) {

        const element =
            document.getElementById("systemStatus");

        const indicator =
            document.getElementById("statusIndicator");

        if (element) {
            element.textContent = status;
        }

        if (indicator) {

            indicator.className = "status-dot";

            if (
                status === "ONLINE" ||
                status === "READY"
            ) {
                indicator.classList.add("online");
            }

        }

    },


    // ==========================================
    // CAMERA
    // ==========================================

    setCameraStatus(status) {

        const element =
            document.getElementById("cameraStatus");

        if (element) {
            element.textContent = status;
        }

    },


    // ==========================================
    // AI
    // ==========================================

    setAIStatus(status) {

        const element =
            document.getElementById("aiStatus");

        if (element) {
            element.textContent = status;
        }

    },


    // ==========================================
    // MODEL
    // ==========================================

    setModelStatus(status) {

        const element =
            document.getElementById("modelStatus");

        if (element) {
            element.textContent = status;
        }

    },


    // ==========================================
    // TRACKING
    // ==========================================

    setTrackStatus(status) {

        const trackElement =
            document.getElementById("trackStatus");

        const trackingElement =
            document.getElementById("trackingStatus");

        if (trackElement) {
            trackElement.textContent = status;
        }

        if (trackingElement) {
            trackingElement.textContent = status;
        }

    },


    // ==========================================
    // DEPTH
    // ==========================================

    setDepthStatus(status) {

        const element =
            document.getElementById("depthStatus");

        if (element) {
            element.textContent = status;
        }

    },


    // ==========================================
    // BATTERY
    // ==========================================

    setBattery(value) {

        const element =
            document.getElementById("battery");

        if (!element) {
            return;
        }

        if (
            value === null ||
            value === undefined ||
            Number.isNaN(value)
        ) {

            element.textContent = "--";

            return;
        }

        element.textContent =
            Math.round(value) + "%";

    },


    // ==========================================
    // SCAN MESSAGE
    // ==========================================

    setTarget(text) {

        const element =
            document.getElementById("scanMessage");

        if (element) {
            element.textContent =
                text || "";
        }

    },


    // ==========================================
    // OBJECT NAME
    // ==========================================

    setObject(name, confidence) {

        const element =
            document.getElementById("objectName");

        if (element) {

            element.textContent =
                name || "NONE";

        }

        if (
            confidence !== undefined
        ) {

            this.setConfidence(
                confidence
            );

        }

    },


    // ==========================================
    // CONFIDENCE
    // ==========================================

    setConfidence(value) {

        const text =
            document.getElementById("confidence");

        const fill =
            document.getElementById("confidenceFill");


        if (
            value === null ||
            value === undefined ||
            Number.isNaN(value)
        ) {

            if (text) {
                text.textContent = "--";
            }

            if (fill) {
                fill.style.width = "0%";
            }

            return;
        }


        const percent =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(value * 100)
                )
            );


        if (text) {
            text.textContent =
                percent + "%";
        }


        if (fill) {
            fill.style.width =
                percent + "%";
        }

    },


    // ==========================================
    // OBJECT COUNT
    // ==========================================

    setObjectCount(count) {

        const element =
            document.getElementById(
                "objectCount"
            );

        if (element) {

            element.textContent =
                Number(count) || 0;

        }

    },


    // ==========================================
    // SCAN RATE
    // ==========================================

    setScanRate(fps) {

        const element =
            document.getElementById(
                "scanRate"
            );

        if (element) {

            element.textContent =
                Math.round(
                    Number(fps) || 0
                ) + " FPS";

        }

    },


    // ==========================================
    // DETECTION BOX
    // ==========================================

    showDetection(name, box) {

        const detection =
            document.getElementById(
                "detectionBox"
            );

        const label =
            document.getElementById(
                "detectionLabel"
            );


        if (!detection) {
            return;
        }


        if (label) {

            label.textContent =
                name || "OBJECT";

        }


        detection.classList.remove(
            "hidden"
        );


        if (
            !box ||
            box.length < 4
        ) {

            return;

        }


        const video =
            document.getElementById(
                "camera"
            );


        if (!video) {
            return;
        }


        if (
            !video.videoWidth ||
            !video.videoHeight
        ) {

            return;

        }


        const screenWidth =
            window.innerWidth;

        const screenHeight =
            window.innerHeight;


        const videoWidth =
            video.videoWidth;

        const videoHeight =
            video.videoHeight;


        /*
         * The camera uses:
         *
         * object-fit: cover
         *
         * so calculate the displayed
         * video scale and crop.
         */

        const scale =
            Math.max(
                screenWidth / videoWidth,
                screenHeight / videoHeight
            );


        const displayedWidth =
            videoWidth * scale;

        const displayedHeight =
            videoHeight * scale;


        const offsetX =
            (
                screenWidth -
                displayedWidth
            ) / 2;


        const offsetY =
            (
                screenHeight -
                displayedHeight
            ) / 2;


        const x = box[0];
        const y = box[1];
        const width = box[2];
        const height = box[3];


        detection.style.left =
            (
                x * scale +
                offsetX
            ) + "px";


        detection.style.top =
            (
                y * scale +
                offsetY
            ) + "px";


        detection.style.width =
            (
                width * scale
            ) + "px";


        detection.style.height =
            (
                height * scale
            ) + "px";

    },


    // ==========================================
    // HIDE DETECTION
    // ==========================================

    hideDetection() {

        const element =
            document.getElementById(
                "detectionBox"
            );

        if (element) {

            element.classList.add(
                "hidden"
            );

        }

    }

};


// ==========================================
// HUD LOADED
// ==========================================

console.log(
    "SPIDER-AI HUD V2.2: READY"
);
