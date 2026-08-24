/* =========================================================
   SPIDER-AI V2
   AI CORE
========================================================= */

const SpiderAI = {

    online: false,

    currentTarget: null,

    lastCommand: null,


    /* =====================================================
       INITIALIZE
    ===================================================== */

    initialize() {

        this.online = true;

        HUD.setAIStatus("ONLINE");

        console.log(
            "SPIDER-AI core initialized."
        );

    },


    /* =====================================================
       RECEIVE VISION DATA
    ===================================================== */

    processDetections(detections) {

        if (!this.online) {
            return;
        }


        if (
            !Array.isArray(detections) ||
            detections.length === 0
        ) {

            this.currentTarget = null;

            HUD.hideDetection();

            HUD.setObject(
                "NO TARGET"
            );

            HUD.setTarget(
                "SCANNING"
            );

            Distance.clear();

            return;
        }


        /*
         * Choose the highest-confidence
         * detection.
         */

        const target =
            detections.reduce(
                (best, item) => {

                    if (!best) {
                        return item;
                    }

                    return item.confidence >
                        best.confidence
                        ? item
                        : best;

                },
                null
            );


        if (!target) {
            return;
        }


        this.currentTarget =
            target;


        HUD.setObject(
            target.name,
            target.confidence
        );


        HUD.showDetection(
            target.name
        );


        HUD.setTarget(
            "TARGET: " +
            target.name.toUpperCase()
        );


        /*
         * Distance is handled separately.
         * We don't invent a number here.
         */

        if (
            target.distance !== undefined
        ) {

            if (
                Distance.mode === "estimate"
            ) {

                Distance.setEstimatedDistance(
                    target.distance
                );

            }

        }

    },


    /* =====================================================
       VOICE COMMANDS
    ===================================================== */

    handleCommand(command) {

        if (!command) {
            return;
        }


        const text =
            command
                .toLowerCase()
                .trim();


        this.lastCommand =
            text;


        console.log(
            "AI command:",
            text
        );


        /*
         * Basic commands.
         */

        if (
            text.includes("what do you see") ||
            text.includes("what am i looking at")
        ) {

            this.describeTarget();

            return;
        }


        if (
            text.includes("distance") ||
            text.includes("how far")
        ) {

            this.describeDistance();

            return;
        }


        if (
            text.includes("status")
        ) {

            this.describeStatus();

            return;
        }


        if (
            text.includes("stop")
        ) {

            this.stop();

            return;
        }


        Voice.speak(
            "I don't have a command for that yet."
        );

    },


    /* =====================================================
       DESCRIBE TARGET
    ===================================================== */

    describeTarget() {

        if (!this.currentTarget) {

            Voice.speak(
                "I don't currently have a detected target."
            );

            return;
        }


        const name =
            this.currentTarget.name;


        const confidence =
            Math.round(
                this.currentTarget.confidence *
                100
            );


        Voice.speak(
            "I see a " +
            name +
            ". Confidence " +
            confidence +
            " percent."
        );

    },


    /* =====================================================
       DESCRIBE DISTANCE
    ===================================================== */

    describeDistance() {

        if (
            Distance.lastDistance === null
        ) {

            Voice.speak(
                "I don't have a reliable distance measurement."
            );

            return;
        }


        const value =
            Distance.lastDistance;


        const unit =
            Distance.unit;


        if (
            Distance.mode === "estimate"
        ) {

            Voice.speak(
                "The estimated distance is " +
                value.toFixed(1) +
                " " +
                unit
            );

            return;
        }


        Voice.speak(
            "The measured distance is " +
            value.toFixed(1) +
            " " +
            unit
        );

    },


    /* =====================================================
       SYSTEM STATUS
    ===================================================== */

    describeStatus() {

        const camera =
            document.getElementById(
                "cameraStatus"
            )?.textContent || "unknown";


        Voice.speak(
            "Spider AI is online. Camera " +
            camera +
            "."
        );

    },


    /* =====================================================
       STOP AI
    ===================================================== */

    stop() {

        this.online = false;

        this.currentTarget = null;


        if (
            typeof Vision !== "undefined"
        ) {

            Vision.stop();

        }


        Distance.clear();


        HUD.setAIStatus(
            "STANDBY"
        );


        HUD.setTarget(
            "AI STOPPED"
        );


        Voice.speak(
            "Spider AI stopped."
        );

    }

};
