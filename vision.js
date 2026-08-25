window.Vision = {

    video: null,
    model: null,
    running: false,
    loading: false,

    lastScanTime: 0,
    stableDetections: [],
    frameHistory: [],

    initialize(video) {

        this.video = video;

        if (!this.video) {
            console.error("VISION: camera missing");
            return false;
        }

        if (typeof cocoSsd === "undefined") {
            console.error("VISION: COCO-SSD not loaded");
            HUD.setAIStatus("ERROR");
            HUD.setTarget("MODEL NOT LOADED");
            return false;
        }

        return true;
    },


    async loadModel() {

        if (this.model) {
            return true;
        }

        try {

            this.loading = true;

            HUD.setAIStatus("LOADING");
            HUD.setTarget("LOADING VISION");

            console.log("VISION: loading model...");

            this.model = await cocoSsd.load();

            this.loading = false;

            HUD.setAIStatus("READY");
            HUD.setTarget("VISION READY");

            console.log("VISION: model ready");

            return true;

        } catch (error) {

            this.loading = false;

            console.error(
                "VISION MODEL ERROR:",
                error
            );

            HUD.setAIStatus("ERROR");
            HUD.setTarget("MODEL ERROR");

            return false;
        }
    },


    start() {

        if (!this.model) {
            console.error("VISION: model not loaded");
            return;
        }

        this.running = true;

        this.frameHistory = [];

        HUD.setAIStatus("ONLINE");
        HUD.setTarget("SCANNING");

        this.scan();
    },


    stop() {

        this.running = false;

        this.frameHistory = [];
        this.stableDetections = [];

        HUD.hideDetection();
        HUD.setAIStatus("STANDBY");
        HUD.setObject("STANDBY");
        HUD.setTarget("VISION OFF");
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
                    this.video,
                    20,
                    0.45
                );


            const detections =
                predictions
                    .filter(
                        item =>
                            item.score >= 0.55
                    )
                    .map(
                        item => ({

                            name: item.class,

                            confidence: item.score,

                            box: item.bbox

                        })
                    );


            this.frameHistory.push(
                detections
            );


            if (this.frameHistory.length > 3) {

                this.frameHistory.shift();

            }


            const stable =
                this.getStableDetections();


            this.stableDetections =
                stable;


            SpiderAI.processDetections(
                stable
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

    },


    getStableDetections() {

        if (
            this.frameHistory.length < 2
        ) {

            return [];

        }


        const results = [];


        const latest =
            this.frameHistory[
                this.frameHistory.length - 1
            ];


        for (const current of latest) {

            let matches = 0;


            for (
                const frame
                of this.frameHistory
            ) {

                const found =
                    frame.some(
                        item =>
                            item.name ===
                            current.name &&
                            this.boxesOverlap(
                                item.box,
                                current.box
                            ) > 0.25
                    );


                if (found) {
                    matches++;
                }

            }


            if (
                matches >= 2
            ) {

                results.push(
                    current
                );

            }

        }


        return results;

    },


    boxesOverlap(a, b) {

        const ax = a[0];
        const ay = a[1];
        const aw = a[2];
        const ah = a[3];

        const bx = b[0];
        const by = b[1];
        const bw = b[2];
        const bh = b[3];


        const left =
            Math.max(ax, bx);

        const right =
            Math.min(
                ax + aw,
                bx + bw
            );

        const top =
            Math.max(ay, by);

        const bottom =
            Math.min(
                ay + ah,
                by + bh
            );


        const width =
            Math.max(
                0,
                right - left
            );

        const height =
            Math.max(
                0,
                bottom - top
            );


        const intersection =
            width * height;


        const areaA =
            aw * ah;

        const areaB =
            bw * bh;


        const union =
            areaA +
            areaB -
            intersection;


        if (union <= 0) {
            return 0;
        }


        return intersection / union;
    }

};

console.log(
    "VISION V2.1: loaded"
);
