const App = {
    started: false,

    async start() {
        const button = document.getElementById("startButton");

        button.textContent = "STARTING...";

        try {
            const camera = document.getElementById("camera");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                },
                audio: false
            });

            camera.srcObject = stream;
            await camera.play();

            this.started = true;

            document.getElementById("systemStatus").textContent = "ONLINE";
            document.getElementById("cameraStatus").textContent = "ON";
            document.getElementById("aiStatus").textContent = "READY";
            document.getElementById("targetText").textContent = "CAMERA ACTIVE";

            button.textContent = "SPIDER-AI ACTIVE";

            console.log("SPIDER-AI camera started.");

        } catch (error) {

            console.error("SPIDER-AI CAMERA ERROR:", error);

            button.textContent = "CAMERA ERROR";

            document.getElementById("systemStatus").textContent = "ERROR";
            document.getElementById("targetText").textContent =
                "CAMERA ACCESS FAILED";
        }
    },


    stop() {

        const camera =
            document.getElementById("camera");

        if (camera.srcObject) {

            camera.srcObject
                .getTracks()
                .forEach(track => track.stop());

            camera.srcObject = null;
        }

        this.started = false;

        document.getElementById("systemStatus").textContent = "READY";
        document.getElementById("cameraStatus").textContent = "OFF";
        document.getElementById("aiStatus").textContent = "STANDBY";
        document.getElementById("targetText").textContent = "CAMERA OFF";

        document.getElementById("startButton").textContent =
            "START SPIDER-AI";
    }
};


window.addEventListener("DOMContentLoaded", () => {

    const button =
        document.getElementById("startButton");

    if (!button) {

        console.error(
            "SPIDER-AI ERROR: startButton not found."
        );

        return;
    }


    button.addEventListener("click", async () => {

        console.log(
            "START SPIDER-AI BUTTON PRESSED"
        );

        if (!App.started) {

            await App.start();

        } else {

            App.stop();

        }

    });


    console.log(
        "SPIDER-AI V2 READY"
    );

});
