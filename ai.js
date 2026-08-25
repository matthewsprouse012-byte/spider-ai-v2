window.SpiderAI = {

    online: false,

    currentTarget: null,

    detections: [],


    initialize() {

        this.online = true;

        HUD.setAIStatus("READY");

        console.log(
            "SPIDER-AI CORE: online"
        );

    },


    processDetections(
        detections
    ) {

        if (!this.online) {
            return;
        }


        this.detections =
            detections || [];


        if (
            this.detections.length === 0
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

            return;
        }


        /*
         * Highest confidence target.
         */

        this.currentTarget =
            this.detections.reduce(
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


        const target =
            this.currentTarget;


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
            "TARGET:",
            target.name,
            target.confidence
        );

    },


    getObjectSummary() {

        if (
            !this.detections ||
            this.detections.length === 0
        ) {

            return "I don't currently see any clearly identified objects.";

        }


        const counts = {};


        for (
            const detection
            of this.detections
        ) {

            const name =
                detection.name;


            if (!counts[name]) {
                counts[name] = 0;
            }


            counts[name]++;

        }


        const parts =
            Object.entries(counts)
                .map(
                    ([name, count]) => {

                        if (count === 1) {
                            return "one " + name;
                        }

                        return (
                            count +
                            " " +
                            name +
                            "s"
                        );

                    }
                );


        return (
            "I see " +
            this.joinList(parts) +
            "."
        );

    },


    joinList(items) {

        if (items.length === 1) {
            return items[0];
        }

        if (items.length === 2) {
            return (
                items[0] +
                " and " +
                items[1]
            );
        }


        return (
            items
                .slice(0, -1)
                .join(", ") +
            ", and " +
            items[items.length - 1]
        );

    },


    describeTarget() {

        if (!this.currentTarget) {

            Voice.speak(
                "I don't currently see a clear target."
            );

            return;

        }


        const target =
            this.currentTarget;


        const confidence =
            Math.round(
                target.confidence * 100
            );


        Voice.speak(
            "I see a " +
            target.name +
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
            "The estimated distance is " +
            Distance.lastDistance
                .toFixed(1) +
            " meters."
        );

    },


    handleCommand(command) {

        if (!command) {
            return;
        }


        console.log(
            "VOICE COMMAND:",
            command
        );


        const text =
            command
                .toLowerCase()
                .trim();


        if (
            text.includes(
                "what do you see"
            ) ||
            text.includes(
                "what can you see"
            ) ||
            text.includes(
                "what am i looking at"
            ) ||
            text.includes(
                "what's in front"
            ) ||
            text.includes(
                "what is in front"
            )
        ) {

            Voice.speak(
                this.getObjectSummary()
            );

            return;

        }


        if (
            text.includes(
                "distance"
            ) ||
            text.includes(
                "how far"
            )
        ) {

            this.describeDistance();

            return;

        }


        if (
            text.includes(
                "how many"
            ) ||
            text.includes(
                "count"
            )
        ) {

            Voice.speak(
                this.getObjectSummary()
            );

            return;

        }


        if (
            text.includes(
                "status"
            )
        ) {

            Voice.speak(
                "Spider AI is online and scanning."
            );

            return;

        }


        Voice.speak(
            "I heard you say " +
            command
        );

    }

};

console.log(
    "AI V2.1: loaded"
);
