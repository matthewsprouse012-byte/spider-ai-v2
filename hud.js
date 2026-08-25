window.HUD = {

    setSystemStatus(status) {

        const el =
            document.getElementById(
                "systemStatus"
            );

        if (el) {
            el.textContent = status;
        }

    },


    setCameraStatus(status) {

        const el =
            document.getElementById(
                "cameraStatus"
            );

        if (el) {
            el.textContent = status;
        }

    },


    setAIStatus(status) {

        const el =
            document.getElementById(
                "aiStatus"
            );

        if (el) {
            el.textContent = status;
        }

    },


    setModelStatus(status) {

        const el =
            document.getElementById(
                "modelStatus"
            );

        if (el) {
            el.textContent = status;
        }

    },


    setTrackStatus(status) {

        const el =
            document.getElementById(
                "trackStatus"
            );

        const main =
            document.getElementById(
                "trackingStatus"
            );


        if (el) {
            el.textContent = status;
        }

        if (main) {
            main.textContent = status;
        }

    },


    setDepthStatus(status) {

        const el =
            document.getElementById(
                "depthStatus"
            );

        if (el) {
            el.textContent = status;
        }

    },


    setBattery(value) {

        const el =
            document.getElementById(
                "battery"
            );

        if (!el) return;


        if (
            value === null ||
            value === undefined
        ) {

            el.textContent = "--";

        } else {

            el.textContent =
                Math.round(value) +
                "%";

        }

    },


    setTarget(text) {

        const el =
            document.getElementById(
                "scanMessage"
            );

        if (el) {
            el.textContent = text;
        }

    },


    setObject(
        name,
        confidence
    ) {

        const el =
            document.getElementById(
                "objectName"
            );

        if (el) {
            el.textContent =
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
            value === undefined
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
            Math.round(
                value * 100
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

        const el =
            document.getElementById(
                "objectCount"
            );

        if (el) {

            el.textContent =
                count;

        }

    },


    setScanRate(fps) {

        const el =
            document.getElementById(
                "scanRate"
            );

        if (el) {

            el.textContent =
                Math.round(fps) +
                " FPS";

        }

    },


    showDetection(
        name,
        box
    ) {

        const boxElement =
            document.getElementById(
                "detectionBox"
            );


        if (!boxElement) {
            return;
        }


        boxElement.classList.remove(
            "hidden"
        );


        if (!box) {
            return;
        }


        const x = box[0];
        const y = box[1];
        const width = box[2];
        const height = box[3];


        /*
         * COCO-SSD coordinates are
         * based on the video frame.
         *
         * Convert them to the
         * displayed camera area.
         */

        const video =
            document.getElementById(
                "camera"
            );


        if (!video) {
            return;
        }


        const scaleX =
            window.innerWidth /
            video.videoWidth;


        const scaleY =
            window.innerHeight /
            video.videoHeight;


        if (
            !Number.isFinite(scaleX) ||
            !Number.isFinite(scaleY)
        ) {

            return;

        }


        boxElement.style.left =
            (
                x * scaleX
            ) + "px";


        boxElement.style.top =
            (
                y * scaleY
            ) + "px";


        boxElement.style.width =
            (
                width * scaleX
            ) + "px";


        boxElement.style.height =
            (
                height * scaleY
            ) + "px";

    },


    hideDetection() {

        const el =
            document.getElementById(
                "detectionBox"
            );

        if (el) {

            el.classList.add(
                "hidden"
            );

        }

    }

};

console.log(
    "HUD V2.2: loaded"
);
