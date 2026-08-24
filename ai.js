window.SpiderAI = {

    online: false,

    currentTarget: null,


    initialize() {

        this.online = true;

        HUD.setAIStatus(
            "READY"
        );

        console.log(
            "AI CORE: online"
        );

    },


    processDetections(
        detections
    ) {

        if (!this.online) {
            return;
        }


        if (
            !detections ||
            detections.length === 0
        ) {

            this.currentTarget =
                null;

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


        const valid =
            detections.filter(
                detection =>
                    detection.confidence >=
                    SPIDER_CONFIG
                        .vision
                        .confidenceThreshold
            );


        if (valid.length === 0) {

            HUD.hideDetection();

            HUD.setObject(
                "UNCERTAIN"
            );

            HUD.setTarget(
                "ANALYZING"
            );

            return;

        }


        const target =
            valid.reduce(
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


        this.currentTarget =
            target;


        HUD.setObject(
            target.name.toUpperCase(),
            target.confidence
        );


        HUD.showDetection(
            target.name.toUpperCase(),
            target.box
        );


        HUD.setTarget(
            "TARGET: " +
            target.name.toUpperCase()
        );


        console.log(
            "AI TARGET:",
            target.name,
            target.confidence
        );

    },


    handleCommand(command) {

        if (!command) return;


        const text =
            command.toLowerCase();


        console.log(
            "AI COMMAND:",
            command
        );


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

            Voice.speak(
                "Spider AI is online."
            );

            return;

        }


        Voice.speak(
            "I heard " + command
        );

    },


    describeTarget() {

        if (!this.currentTarget) {

            Voice.speak(
                "I don't currently see a target."
            );

            return;

        }


        const name =
            this.currentTarget.name;


        const confidence =
            Math.round(
                this.currentTarget
                    .confidence * 100
            );


        Voice.speak(
            "I see a " +
            name +
            " with " +
            confidence +
            " percent confidence."
        );

    },


    describeDistance() {

        if (
            Distance.lastDistance === null
        ) {

            Voice.speak(
                "I don't have a reliable distance measurement yet."
            );

            return;

        }


        Voice.speak(
            "The distance is " +
            Distance.lastDistance
                .toFixed(1) +
            " meters."
        );

    }

};

console.log("AI CORE: loaded");
