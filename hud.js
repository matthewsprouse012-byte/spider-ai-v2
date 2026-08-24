/* =========================================================
   SPIDER-AI V2
   HUD CONTROLLER
========================================================= */

window.HUD = {

    setSystemStatus(status) {
        const el = document.getElementById("systemStatus");
        if (el) el.textContent = status;
    },

    setCameraStatus(status) {
        const el = document.getElementById("cameraStatus");
        if (el) el.textContent = status;
    },

    setAIStatus(status) {
        const el = document.getElementById("aiStatus");
        if (el) el.textContent = status;
    },

    setDepthStatus(status) {
        const el = document.getElementById("depthStatus");
        if (el) el.textContent = status;
    },

    setBattery(percent) {
        const el = document.getElementById("battery");

        if (!el) return;

        if (percent === null || percent === undefined) {
            el.textContent = "--%";
        } else {
            el.textContent = Math.round(percent) + "%";
        }
    },

    setTarget(text) {
        const el = document.getElementById("targetText");
        if (el) el.textContent = text;
    },

    setObject(name, confidence = null) {
        const nameEl = document.getElementById("objectName");
        const confidenceEl = document.getElementById("confidence");

        if (nameEl) {
            nameEl.textContent = name || "UNKNOWN";
        }

        if (confidenceEl) {
            if (confidence === null || confidence === undefined) {
                confidenceEl.textContent = "CONFIDENCE: --";
            } else {
                confidenceEl.textContent =
                    "CONFIDENCE: " +
                    Math.round(confidence * 100) +
                    "%";
            }
        }
    },

    showDetection(name) {
        const box = document.getElementById("detectionBox");
        const label = document.getElementById("detectionLabel");

        if (box) box.classList.remove("hidden");
        if (label) label.textContent = name || "OBJECT";
    },

    hideDetection() {
        const box = document.getElementById("detectionBox");

        if (box) {
            box.classList.add("hidden");
        }
    },

    setDistance(value, mode = "none") {
        const distanceEl = document.getElementById("distance");
        const modeEl = document.getElementById("distanceMode");

        if (distanceEl) {
            if (value === null || value === undefined) {
                distanceEl.textContent = "--";
            } else {
                distanceEl.textContent =
                    Number(value).toFixed(1);
            }
        }

        if (modeEl) {
            if (mode === "sensor") {
                modeEl.textContent = "MEASUREMENT: SENSOR";
            } else if (mode === "estimate") {
                modeEl.textContent = "MEASUREMENT: ESTIMATE";
            } else {
                modeEl.textContent = "SENSOR: NOT CONNECTED";
            }
        }
    },

    setVoiceStatus(status) {
        const el = document.getElementById("voiceStatus");
        if (el) el.textContent = status;
    }

};

console.log("HUD system loaded.");
