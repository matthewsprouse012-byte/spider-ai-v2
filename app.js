console.log("TEST APP.JS LOADED");

window.addEventListener("DOMContentLoaded", () => {

    console.log("TEST: DOM READY");

    const button =
        document.getElementById("startButton");

    if (!button) {
        console.error("TEST: startButton NOT FOUND");
        return;
    }

    console.log("TEST: BUTTON FOUND");

    button.addEventListener("click", () => {

        console.log("TEST: BUTTON CLICKED");

        button.textContent = "BUTTON WORKS";

    });

});
