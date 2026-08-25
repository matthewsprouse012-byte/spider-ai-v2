window.HUD = {

    setSystemStatus(status) {

        const element =
            document.getElementById(
                "systemStatus"
            );

        const indicator =
            document.getElementById(
                "statusIndicator"
            );


        if (element) {
            element.textContent =
                status;
        }


        if (indicator) {

            indicator.className =
                "status-dot";


            if (
                status === "ONLINE" ||
                status === "READY"
            ) {

                indicator.classList.add(
                    "online"
                );

            }

        }

    },


    setCameraStatus(status) {

        const element =
            document.getElementById(
                "cameraStatus"
            );

        if (element) {
            element.textContent =
                status;
        }

    },


    setAIStatus(status) {

        const element =
            document.getElementById(
                "aiStatus"
            );

        if (element) {
            element.textContent =
                status;
        }

    },


    setModelStatus(status) {

        const element =
            document.getElementById(
                "modelStatus"
            );

        if (element) {
            element.textContent =
                status;
        }

    },


    setTrackStatus(status) {

        const element =
            document.getElementById(
                "trackStatus"
            );

        const trackingElement =
            document.getElementById(
                "trackingStatus"
            );


        if (element) {
            element.textContent =
                status;
        }


        if (trackingElement) {
            trackingElement.textContent =
                status;
        }

    },


    setDepthStatus(status) {

        const element =
            document.getElementById(
                "depthStatus"
            );

        if (element) {
            element.textContent =
                status;
        }

    },


    setBattery(value) {

        const element =
            document.getElementById(
                "battery"
            );


        if (!element) {
            return;
        }


        if (
            value === null ||
            value === undefined
        ) {

            element.textContent =
                "--";

            return;

        }


        element.textContent =
            Math.round(value) +
            "%";

    },


    setTarget(text) {

        const element =
            document.getElementById(
                "scanMessage"
            );


        if (element) {
            element.textContent =
                text;
        }

    },


    setObject(
        name,
        confidence
    ) {

        const element =
            document.getElementById(
                "objectName"
            );


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


    setConfidence(value) {

        const text =
            document.getElementById(
                "confidence"
            );

        const fill =
            document.getElementById(
                "confidenceFill"
            );


        if (
            value === null ||
            value === undefined ||
            Number.isNaN(value)
        ) {

            if (text) {
                text.textContent =
                    "--";
            }

            if (fill) {
                fill.style.width =
                    "0%";
            }

            return;

        }


        const percent =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        value * 100
                    )
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


    setObjectCount(count) {

        const element =
            document.getElementById(
                "objectCount"
            );


        if (element) {

            element.textContent =
                count || 0;

        }

    },


    setScanRate(fps) {

        const element =
            document.getElementById(
                "scanRate"
            );


        if (element) {

            element.textContent =
                Math.round(
                    fps || 0
                ) +
                " FPS";

        }

    },


    showDetection(
        name,
        box
    ) {

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


        const videoWidth =
            video.videoWidth;


        const videoHeight =
            video.videoHeight;


        /*
         * COCO-SSD gives coordinates
         * relative to the actual video.
         */

        const x = box[0];
        const y = box[1];
        const width = box[2];
        const height = box[3];


        /*
         * object-fit: cover means
         * the video may be cropped.
         *
         * Calculate the actual
         * displayed camera rectangle.
         */

        const screenWidth =
            window.innerWidth;


        const screenHeight =
            window.innerHeight;


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


console.log(
    "HUD V2.2: loaded"
);
