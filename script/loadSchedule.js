const loadFullSchedule = {
    bucket: "https://instructor-snow-com.s3.us-west-1.amazonaws.com/",
    url: null,
    initiate: function (date) {

        // set the date 
        this.date = date;

        const maxDate = new Date( new Date().getFullYear() + 1, 5 , 1);
        if ( date > maxDate ) {
            console.error("Date beyond current scope");
            return;
        }

        // credentials        
        this.credentials = settings.credentials(this.date);

        // localStorage to object data
        if (localStorage.schedule == undefined) {
            this.data = {}
        } else {
            this.data = JSON.parse(localStorage.getItem("schedule"));
        }
        
        // Create a Winter Season Property
        this.season = (this.date.getFullYear() - 1) + '-' + this.date.getFullYear();
        if (this.date.getMonth() > 9) {
            this.season = this.date.getFullYear() + '-' + (this.date.getFullYear() + 1);
        }

        //console.log(this.season);

        // Create a URL for the user
        this.url = this.getURL();
        
        // GET the data from the bucket
        this.get();

        // How old is the data?
        // only test the current season
        // older season data should have to be manually updated in the settings page.
        if( this.season == "2024-2025" ) {            
            this.test();
        }
    },
    test: function () {
        function getMinutesDifference(date1, date2) {
            const diffInMilliseconds = date2.getTime() - date1.getTime();
            const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
            return diffInMinutes;
        }
        
        var lastModified = null;
        // get the doc head to see if 
        try {
            //var settings = JSON.parse(localStorage.getItem("settings"));
            var url = this.bucket + "data/" + settings.passNumber + "/" + this.season + ".json";

            //console.log("test lastmodifieddate: ", url)

            fetch(url, { method: "HEAD" })
                .then(response => {           
                    
                    var lastModified = new Date(response.headers.get("Last-Modified"));
                    
                    var minutesElapsed = getMinutesDifference(lastModified, new Date());
                    if (minutesElapsed > 30) {
                        this.post();
                    }
                })
                .catch(error => {
                    console.error("Error: ", error);
                });
        } catch (error) {
            console.error('Error fetching resource:', error);
            return null;
        }
    },    
    get: function () {
        fetch(this.url)
            .then(response => response.json())
            .then(data => {
                this.mergeSchedule(data);                
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    },
    post: function () {
        const lambda = "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/daily";        
        fetch(lambda, { method: "POST", body: JSON.stringify(this.credentials), headers: { "Content-Type": "application/json" } })
            .then(response => response.json())
            .then(data => {
                if (!data.hasOwnProperty("error")) {
                    // 
                    this.mergeSchedule(data);
                    //console.log("21 days schedule received: ", this.date, this.credentials);                   
                }
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    },     
    getURL: function () {        
        return this.bucket + "data/" + settings.passNumber + "/" + this.season + ".json";
    },
    mergeSchedule: function (incoming) {        
        if (incoming != null) {
            Object.keys(incoming).forEach(key => {
                var keyDate = new Date(key);
                var date = new Date(keyDate.getFullYear(), keyDate.getMonth(), keyDate.getDate());
                //console.log(date)
                //this.data[date.toLocaleDateString()] = incoming[key];
                this.data[date.toISOString()] = incoming[key];
            });
            this.saveSchedule();
        }
    },
    saveSchedule: function () {
        localStorage.setItem("schedule", JSON.stringify(this.data));
    }
}
