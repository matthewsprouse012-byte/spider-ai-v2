window.Distance = {

    mode: "none",

    lastDistance: null,

    unit: "meters",


    initialize() {

        this.mode =
            SPIDER_CONFIG.distance.mode;

        this.unit =
            SPIDER_CONFIG.distance.unit;

        this.clear();

        console.log(
            "DISTANCE:",
            this.mode
        );

    },


    clear() {

        this.lastDistance = null;

        HUD.setDepthStatus("OFF");

        HUD.setDistance(
            null,
            "none"
        );

    },


    setEstimatedDistance(value) {

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

        this.lastDistance = value;

        HUD.setDepthStatus(
            "ESTIMATE"
        );

        HUD.setDistance(
            value,
            "estimate"
        );

    },


    setSensorDistance(value) {

        if (this.mode !== "sensor") {
            return;
        }

        if (
            typeof value !== "number" ||
            !Number.isFinite(value) ||
            value < 0
        ) {
            return;
        }

        this.lastDistance = value;

        HUD.setDepthStatus(
            "SENSOR"
        );

        HUD.setDistance(
            value,
            "sensor"
        );

    }

};

console.log("DISTANCE: loaded");
