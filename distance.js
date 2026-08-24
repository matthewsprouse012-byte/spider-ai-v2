/* =========================================================
   SPIDER-AI V2
   DISTANCE SYSTEM
========================================================= */

const Distance = {

    mode: "none",

    lastDistance: null,

    unit: "meters",


    /* =====================================================
       INITIALIZE
    ===================================================== */

    initialize() {

        this.mode =
            SPIDER_CONFIG.distance.mode;

        this.unit =
            SPIDER_CONFIG.distance.unit;


        this.updateHUD();


        console.log(
            "Distance system:",
            this.mode
        );

    },


    /* =====================================================
       SET MODE
    ===================================================== */

    setMode(mode) {

        const validModes = [
            "none",
            "estimate",
            "sensor"
        ];


        if (!validModes.includes(mode)) {

            console.error(
                "Invalid distance mode:",
                mode
            );

            return;
        }


        this.mode = mode;

        this.updateHUD();

    },


    /* =====================================================
       SENSOR MEASUREMENT
    ===================================================== */

    setSensorDistance(value) {

        /*
         * This function is reserved for
         * a future real distance/depth sensor.
         */

        if (this.mode !== "sensor") {

            console.warn(
                "Sensor distance received while sensor mode is disabled."
            );

            return;
        }


        if (
            typeof value !== "number" ||
            !Number.isFinite(value) ||
            value < 0
        ) {

            return;
        }


        this.lastDistance =
            value;


        this.updateHUD();

    },


    /* =====================================================
       ESTIMATED DISTANCE
    ===================================================== */

    setEstimatedDistance(value) {

        /*
         * An estimate must never be presented
         * as a real sensor measurement.
         */

        if (this.mode !== "estimate") {
            return;
        }


        if (
            typeof value !== "number" ||
            !Number.isFinite(value) ||
            value < 0
        ) {

            return;
        }


        this.lastDistance =
            value;


        this.updateHUD();

    },


    /* =====================================================
       CLEAR DISTANCE
    ===================================================== */

    clear() {

        this.lastDistance =
            null;


        this.updateHUD();

    },


    /* =====================================================
       UPDATE HUD
    ===================================================== */

    updateHUD() {

        if (this.mode === "sensor") {

            HUD.setDepthStatus(
                "SENSOR"
            );


            HUD.setDistance(
                this.lastDistance,
                "sensor"
            );


            return;
        }


        if (this.mode === "estimate") {

            HUD.setDepthStatus(
                "ESTIMATE"
            );


            HUD.setDistance(
                this.lastDistance,
                "estimate"
            );


            return;
        }


        /*
         * No measurement system.
         */

        HUD.setDepthStatus(
            "OFF"
        );


        HUD.setDistance(
            null,
            "none"
        );

    }

};
