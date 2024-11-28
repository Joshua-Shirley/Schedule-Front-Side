const Schedule = {
    bucket: "https://instructor-snow-com.s3.us-west-1.amazonaws.com/",
    lastUpdate: null,
    initiate: (settings, callback) => {
        Schedule.settings = settings;
        Schedule.callback = callback;
        Schedule.lastUpdate = new Date();
        Schedule.data = {};
        Schedule.loadSchedule();
        // GET the full season from S3 bucket
        Schedule.fullSeason();
    },
    fullSeason: (runUpdate = true) => {
        let season = "2024-2025";
        let path = Schedule.bucket + "data/" + Schedule.settings.passNumber + "/" + season + ".json";
        fetch(path)
            .then(response => response.json())
            .then(data => {
                Schedule.mergeSchedule(data.schedule);
                // if this is looping stop the loop
                if (runUpdate) {
                    Schedule.updateRequired(new Date(data.last_modified));
                }
            })
            .catch(error => {
                console.error(error);
            });
    },
    monthly: () => {
        const path = "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/monthly";
        fetch(path, { method: "POST", body: JSON.stringify(Schedule.settings.credentials(new Date())), headers: { "Content-Type": "application/json" } })
            .then(response => response.json())
            .then(data => {
                Schedule.mergeSchedule(data);
                console.log("monthly update");
                console.log(data);
                try {
                    Schedule.lastUpdate = new Date();
                }
                catch (error) {
                    console.error(error, data)
                }

                Schedule.callback();
            })
            .catch(error => console.log(error));
    },
    updateSeason: () => {
        const path = "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/season";
        fetch(path, { method: "POST", body: JSON.stringify(Schedule.settings.credentials(new Date())), headers: { "Content-Type": "application/json" } })
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                Schedule.fullSeason(false);
            })
            .catch(error => console.log(error));
    },
    checkTimeDifference: (dateA, dateB, minute = 15) => {
        const milliseconds = 1000;
        const seconds = 60;
        let minutes = minute;
        let fifteenMinutes = (milliseconds * seconds * minutes);

        var diff = dateB.getTime() - dateA.getTime();
        if (dateA.getTime() > dateB.getTime()) {
            diff = dateA.getTime() - dateB.getTime();
        }

        if (diff > fifteenMinutes) {
            return true;
        } else {
            return false;
        }
    },
    updateRequired: (date) => {
        if (Schedule.checkTimeDifference(new Date(), date)) {
            console.log("Update triggered")
            document.querySelector("#updatingBadge").classList.remove("invisible");
            Schedule.monthly();
            Schedule.updateSeason();
        } else {
            console.log("Data is fresh")
        }
    },
    mergeSchedule: (incoming) => {
        if (incoming != null) {
            Object.keys(incoming).forEach(key => {
                var keyDate = new Date(key);
                var date = new Date(keyDate.getFullYear(), keyDate.getMonth(), keyDate.getDate());
                Schedule.data[date.toISOString()] = incoming[key];
            });
            Schedule.saveSchedule();
        }
    },
    loadSchedule: function () {
        // localStorage to object data
        if (localStorage.schedule == undefined) {
            Schedule.data = {}
        } else {
            Schedule.data = JSON.parse(localStorage.getItem("schedule"));
        }
    },
    saveSchedule: function () {
        localStorage.setItem("schedule", JSON.stringify(Schedule.data));
    }
}

