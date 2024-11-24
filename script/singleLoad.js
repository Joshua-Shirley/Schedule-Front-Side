const Schedule = {
    bucket: "https://instructor-snow-com.s3.us-west-1.amazonaws.com/",
    initiate: (settings, callback) => {        
        Schedule.settings = settings;        
        Schedule.callback = callback;
        Schedule.data = {};
        Schedule.loadSchedule();
        // GET the full season from S3 bucket
        Schedule.fullSeason();
    },
    fullSeason: () => {
        let season = "2024-2025";
        let path = Schedule.bucket + "data/" + Schedule.settings.passNumber + "/" + season + ".json";
        fetch( path )
        .then(response => response.json())                             
        .then(data => {
            Schedule.mergeSchedule(data.schedule);
            Schedule.updateRequired(new Date(data.last_modified));
        })
        .catch(error => console.error(error));
    },
    monthly: () => {
        const path = "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/monthly";
        fetch( path , { method: "POST", body: JSON.stringify(Schedule.settings.credentials(new Date())), headers: { "Content-Type": "application/json" } })
        .then(response => response.json())
        .then(data => {
            Schedule.mergeSchedule(data);
            console.log( "monthly update ")
            Schedule.callback();
        })
        .catch(error => console.log(error));
    },
    updateSeason: () => {
        const path = "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/season";
        fetch( path , { method: "POST", body: JSON.stringify(Schedule.settings.credentials(new Date())), headers: { "Content-Type": "application/json" } })
        .then(response => response.json())
        .then(data => console.log(data))        
        .catch(error => console.log(error));
    },
    updateRequired: (date) => {
        let diff = new Date().getTime() - date.getTime();

        const milliseconds = 1000;
        const seconds = 60;
        const minutes = 15;
        const timeDiff = ( milliseconds * seconds * minutes );

        if ( diff > timeDiff) {            
            Schedule.monthly();
            Schedule.updateSeason();
        } else {
            console.log( "Fresh" )
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
    loadSchedule: function() {
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

