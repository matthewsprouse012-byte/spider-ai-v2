window.HUD = {

    setSystemStatus(status) {

        const el =
            document.getElementById("systemStatus");

        if (el) el.textContent = status;

    },


    setCameraStatus(status) {

        const el =
            document.getElementById("cameraStatus");

        if (el) el.textContent = status;

    },


    setAIStatus(status) {

        const el =
            document.getElementById("aiStatus");

        if (el) el.textContent = status;

    },


    setDepthStatus(status) {

        const el =
            document.getElementById("depthStatus");

        if (el) el.textContent = status;

    },


    setBattery(value) {

        const el =
            document.getElementById("battery");

        if (!el) return;

        if (value === null || value === undefined) {

            el.textContent = "--%";

        } else {

            el.textContent =
                Math.round(value) + "%";

        }

    },


    setTarget(text) {

        const el =
            document.getElementById("targetText");

        if (el) el.textContent = text;

    },


    setObject(name, confidence = null) {

        const nameEl =
            document.getElementById("objectName");

        const confidenceEl =
            document.getElementById("confidence");


        if (nameEl) {

            nameEl.textContent =
                name || "UNKNOWN";

        }


        if (confidenceEl) {

            if (
                confidence === null ||
                confidence === undefined
            ) {

                confidenceEl.textContent =
                    "CONFIDENCE: --";

            } else {

                confidenceEl.textContent =
                    "CONFIDENCE: " +
                    Math.round(
                        confidence * 100
                    ) +
                    "%";

            }

        }

    },


    showDetection(name, box) {

        const detection =
            document.getElementById(
                "detectionBox"
            );

        const label =
            document.getElementById(
                "detectionLabel"
            );


        if (!detection) return;


        detection.classList.remove(
            "hidden"
        );


        if (label) {

            label.textContent =
                name || "OBJECT";

        }


        if (!box) return;


        const [x, y, width, height] =
            box;


        detection.style.left =
            x + "px";

        detection.style.top =
            y + "px";

        detection.style.width =
            width + "px";

        detection.style.height =
            height + "px";

    },


    hideDetection() {

        const detection =
            document.getElementById(
                "detectionBox"
            );

        if (detection) {

            detection.classList.add(
                "hidden"
            );

        }

    },


    setDistance(value, mode) {

        const distance =
            document.getElementById(
                "distance"
            );

        const modeEl =
            document.getElementById(
                "distanceMode"
            );


        if (distance) {

            if (
                value === null ||
                value === undefined
            ) {

                distance.textContent = "--";

            } else {

                distance.textContent =
                    Number(value).toFixed(1);

            }

        }


        if (modeEl) {

            if (mode === "sensor") {

                modeEl.textContent =
                    "MEASUREMENT: SENSOR";

            } else if (mode === "estimate") {

                modeEl.textContent =
                    "MEASUREMENT: ESTIMATE";

            } else {

                modeEl.textContent =
                    "SENSOR: NOT CONNECTED";

            }

        }

    },


    setVoiceStatus(status) {

        const el =
            document.getElementById(
                "voiceStatus"
            );

        if (el) el.textContent = status;

    }

};

console.log("HUD: loaded");
