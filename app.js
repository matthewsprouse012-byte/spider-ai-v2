window.App = {

    initialize() {
        console.log("NEW SPIDER-AI APP.JS LOADED");
    },

    start() {
        console.log("SPIDER-AI START");
    },

    stop() {
        console.log("SPIDER-AI STOP");
    }

};

window.addEventListener("DOMContentLoaded", () => {
    App.initialize();
});
