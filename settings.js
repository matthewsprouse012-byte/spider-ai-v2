/* =========================================================
   SPIDER-AI V2
   SETTINGS
========================================================= */

const SPIDER_CONFIG = {

    appName: "SPIDER-AI",

    version: "2.0",

    camera: {
        preferredFacingMode: "environment",
        audio: false
    },

    vision: {
        enabled: true,
        confidenceThreshold: 0.55,
        maxObjects: 10
    },

    distance: {
        enabled: true,

        /*
         * "none"      = no distance measurement
         * "estimate"  = camera/model estimate
         * "sensor"    = actual connected sensor
         */
        mode: "none",

        unit: "meters"
    },

    voice: {
        enabled: true,
        speechRate: 1,
        speechPitch: 1
    },

    hud: {
        showBattery: true,
        showDistance: true,
        showConfidence: true,
        showSystemStatus: true
    }

};
