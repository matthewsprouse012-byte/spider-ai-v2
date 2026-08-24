window.Vision = {

    video: null,

    model: null,

    running: false,

    loading: false,


    async initialize(video) {

        this.video = video;


        if (!this.video) {

            console.error(
                "VISION: camera missing"
            );

            return false;

        }


        if (
            typeof cocoSsd ===
            "undefined"
        ) {

            console.error(
                "VISION: COCO-SSD missing"
            );

            HUD.setAIStatus(
                "ERROR"
            );

            HUD.setTarget(
                "MODEL NOT LOADED"
            );

            return false;

        }


        try {

            this.loading = true;

            HUD.setAIStatus(
                "LOADING"
            );

            HUD.setTarget(
                "LOADING AI MODEL"
            );


            this.model =
                await cocoSsd.load();


            this.loading = false;


            HUD.setAIStatus(
                "READY"
            );

            HUD.setTarget(
                "VISION READY"
            );


            console.log(
                "VISION: model ready"
            );


            return true;

        } catch (error) {

            this.loading = false;

            console.error(
                "VISION MODEL ERROR:",
                error
            );


            HUD.setAIStatus(
                "ERROR"
            );

            HUD.setTarget(
                "MODEL ERROR"
            );


            return false;

        }

    },


    start() {

        if (!this.model) {

            console.error(
                "VISION: no model"
            );

            return;

        }


        this.running = true;


        HUD.setAIStatus(
            "ONLINE"
        );


        HUD.setTarget(
            "SCANNING"
        );


        this.scan();

    },


    stop() {

        this.running = false;


        HUD.hideDetection();


        HUD.setAIStatus(
            "STANDBY"
        );


        HUD.setObject(
            "STANDBY"
        );


        HUD.setTarget(
            "VISION OFF"
        );

    },


    async scan() {

        if (!this.running) {
            return;
        }


        if (
            !this.video ||
            this.video.readyState < 2
        ) {

            setTimeout(
                () => this.scan(),
                300
            );

            return;

        }


        try {

            const predictions =
                await this.model.detect(
                    this.video
                );


            const detections =
                predictions.map(
                    prediction => ({

                        name:
                            prediction.class,

                        confidence:
                            prediction.score,

                        box:
                            prediction.bbox

                    })
                );


            SpiderAI.processDetections(
                detections
            );


        } catch (error) {

            console.error(
                "VISION SCAN ERROR:",
                error
            );

        }


        if (this.running) {

            setTimeout(
                () => this.scan(),
                SPIDER_CONFIG
                    .vision
                    .scanInterval
            );

        }

    }

};

console.log("VISION: loaded");
