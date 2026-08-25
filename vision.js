window.Vision = {

    video: null,

    model: null,

    running: false,

    loading: false,

    frameHistory: [],

    lastScanTime: 0,

    scanCount: 0,

    fps: 0,

    fpsTimer: 0,


    initialize(video) {

        this.video = video;


        if (!video) {

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
                "VISION: model library missing"
            );

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

            HUD.setAIStatus(
                "LOADING"
            );

            HUD.setModelStatus(
                "LOADING"
            );


            this.model =
                await cocoSsd.load();


            this.loading = false;


            HUD.setAIStatus(
                "READY"
            );

            HUD.setModelStatus(
                "READY"
            );


            console.log(
                "VISION: MODEL READY"
            );


            return true;

        } catch (error) {

            this.loading = false;

            console.error(
                "VISION:",
                error
            );


            HUD.setAIStatus(
                "ERROR"
            );

            HUD.setModelStatus(
                "ERROR"
            );


            return false;

        }

    },


    start() {

        if (!this.model) {

            console.error(
                "VISION: model unavailable"
            );

            return;

        }


        this.running = true;

        this.frameHistory = [];

        this.scanCount = 0;

        this.fpsTimer =
            performance.now();


        HUD.setAIStatus(
            "ONLINE"
        );


        HUD.setTrackStatus(
            "SEARCHING"
        );


        this.scan();

    },


    stop() {

        this.running = false;

        this.frameHistory = [];

        this.scanCount = 0;


        HUD.setAIStatus(
            "STANDBY"
        );

        HUD.setTrackStatus(
            "OFF"
        );

        HUD.setObjectCount(
            0
        );

        HUD.setScanRate(
            0
        );

        HUD.hideDetection();

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


        const start =
            performance.now();


        try {

            const predictions =
                await this.model.detect(
                    this.video,
                    20,
                    0.50
                );


            const detections =
                predictions
                    .filter(
                        item =>
                            item.score >=
                            0.50
                    )
                    .map(
                        item => ({

                            name:
                                item.class,

                            confidence:
                                item.score,

                            box:
                                item.bbox

                        })
                    );


            this.addFrame(
                detections
            );


            const stable =
                this.getStableTargets();


            this.scanCount++;


            this.updateFPS(
                start
            );


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
                120
            );

        }

    },


    addFrame(detections) {

        this.frameHistory.push({

            time:
                performance.now(),

            detections:
                detections

        });


        /*
         * Keep only the most
         * recent 5 scans.
         */

        if (
            this.frameHistory.length > 5
        ) {

            this.frameHistory.shift();

        }

    },


    getStableTargets() {

        if (
            this.frameHistory.length < 2
        ) {

            return [];

        }


        const latest =
            this.frameHistory[
                this.frameHistory.length - 1
            ].detections;


        const stable = [];


        for (
            const candidate
            of latest
        ) {


            let appearances = 0;

            let confidenceTotal = 0;

            let matchingBox = null;


            for (
                const frame
                of this.frameHistory
            ) {

                const match =
                    frame.detections.find(
                        item =>

                            item.name ===
                            candidate.name &&

                            this.iou(
                                item.box,
                                candidate.box
                            ) >= 0.25
                    );


                if (match) {

                    appearances++;

                    confidenceTotal +=
                        match.confidence;

                    matchingBox =
                        match.box;

                }

            }


            /*
             * Require the object to
             * survive multiple scans.
             */

            if (
                appearances >= 2
            ) {

                stable.push({

                    name:
                        candidate.name,

                    confidence:
                        confidenceTotal /
                        appearances,

                    box:
                        matchingBox ||
                        candidate.box,

                    stability:
                        appearances /
                        this.frameHistory.length

                });

            }

        }


        return stable;

    },


    iou(a, b) {

        const ax = a[0];
        const ay = a[1];
        const aw = a[2];
        const ah = a[3];

        const bx = b[0];
        const by = b[1];
        const bw = b[2];
        const bh = b[3];


        const left =
            Math.max(
                ax,
                bx
            );


        const top =
            Math.max(
                ay,
                by
            );


        const right =
            Math.min(
                ax + aw,
                bx + bw
            );


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


        if (
            union <= 0
        ) {

            return 0;

        }


        return (
            intersection /
            union
        );

    },


    updateFPS(startTime) {

        const now =
            performance.now();


        if (
            now -
            this.fpsTimer >=
            1000
        ) {

            this.fps =
                this.scanCount /
                (
                    (now -
                    this.fpsTimer) /
                    1000
                );


            this.scanCount = 0;

            this.fpsTimer = now;


            HUD.setScanRate(
                this.fps
            );

        }

    }

};

console.log(
    "VISION V2.2: loaded"
);
