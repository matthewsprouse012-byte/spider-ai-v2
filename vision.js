/* =========================================================
   SPIDER-AI V2
   VISION SYSTEM
========================================================= */

const Vision = {

    video: null,

    running: false,

    model: null,

    detections: [],


    /* =====================================================
       INITIALIZE
    ===================================================== */

    initialize(videoElement) {

        this.video = videoElement;

        if (!this.video) {

            console.error(
                "Vision: camera element not found."
            );

            return false;
        }

        console.log(
            "Vision system initialized."
        );

        return true;
    },


    /* =====================================================
       START VISION
    ===================================================== */

    start() {

        if (!this.video) {

            console.error(
                "Vision: not initialized."
            );

            return;
        }


        this.running = true;


        HUD.setAIStatus(
            "STARTING"
        );


        HUD.setTarget(
            "VISION STARTING"
        );


        /*
         * The actual AI model will be
         * loaded in the next stage.
         */

        this.startProcessing();


    },


    /* =====================================================
       STOP VISION
    ===================================================== */

    stop() {

        this.running = false;

        this.detections = [];


        HUD.setAIStatus(
            "STANDBY"
        );


        HUD.hideDetection();


        HUD.setObject(
            "STANDBY"
        );


        HUD.setTarget(
            "VISION OFF"
        );

    },


    /* =====================================================
       PROCESS CAMERA
    ===================================================== */

    startProcessing() {

        if (!this.running) {
            return;
        }


        /*
         * We use requestAnimationFrame so
         * the vision system can eventually
         * analyze the camera frames.
         */

        requestAnimationFrame(
            () => {

                this.processFrame();

            }
        );

    },


    /* =====================================================
       PROCESS ONE FRAME
    ===================================================== */

    processFrame() {

        if (!this.running) {
            return;
        }


        if (
            !this.video ||
            this.video.readyState < 2
        ) {

            this.startProcessing();

            return;
        }


        /*
         * AI object detection will go here.
         *
         * We deliberately do NOT invent
         * detections when the model isn't loaded.
         */

        if (!this.model) {

            HUD.setAIStatus(
                "READY"
            );


            HUD.setTarget(
                "AI MODEL NOT LOADED"
            );

        }


        this.startProcessing();

    },


    /* =====================================================
       SET MODEL
    ===================================================== */

    setModel(model) {

        this.model = model;


        if (model) {

            HUD.setAIStatus(
                "ONLINE"
            );


            HUD.setTarget(
                "VISION ACTIVE"
            );

        }

    },


    /* =====================================================
       RECEIVE DETECTIONS
    ===================================================== */

    updateDetections(detections) {

        this.detections =
            detections || [];


        if (
            this.detections.length === 0
        ) {

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
         * Pick the highest-confidence
         * detection.
         */

        const best =
            this.detections.reduce(
                (current, item) => {

                    if (!current) {
                        return item;
                    }

                    return item.confidence >
                        current.confidence
                        ? item
                        : current;

                },
                null
            );


        if (!best) {
            return;
        }


        HUD.setObject(
            best.name,
            best.confidence
        );


        HUD.showDetection(
            best.name
        );


        HUD.setTarget(
            "TARGET DETECTED"
        );

    }

};
