window.SPIDER_CONFIG = {

    appName: "SPIDER-AI",

    version: "2.0",

    camera: {
        facingMode: "environment"
    },

    vision: {
        confidenceThreshold: 0.55,
        scanInterval: 200
    },

    distance: {
        mode: "none",
        unit: "meters"
    },

    voice: {
        enabled: true,
        rate: 1,
        pitch: 1
    }

};

console.log("SETTINGS: loaded");
