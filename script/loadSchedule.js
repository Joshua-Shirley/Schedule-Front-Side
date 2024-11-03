const loadFullSchedule = {
    bucket: "https://instructor-snow-com.s3.us-west-1.amazonaws.com/",
    url: null,      
    initiate: function(date) {
        
        // set the date 
        this.date = date;

        // localStorage to object data
        this.data = JSON.parse(localStorage.getItem("schedule"));

        // Create a Winter Season Property
        this.season = (this.date.getFullYear() - 1) + '-' + this.date.getFullYear();
        if ( this.date.getMonth() > 9 ){
            this.season = this.date.getFullYear() + '-' + ( this.date.getFullYear() + 1 );
        } 

        // Create a URL for the user
        this.url = this.getURL();

        // GET the data from the bucket
        this.get();
    },
    get: function () {        
        fetch(this.url)
            .then(response => response.json())
            .then(data => {                
                this.mergeSchedule(data);                
                //console.log(loadFullSchedule.season + " loaded");
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    },
    getURL: function() {
        var settings = JSON.parse(localStorage.getItem("settings"));        
        return this.bucket + "data/" + settings.passNumber + "/" + this.season + ".json";
    },
    mergeSchedule: function(incoming) {
        if (incoming != null) {
            Object.keys(incoming).forEach( key => {
                this.data[key] = incoming[key];
            });
            this.saveSchedule();
        }
    },
    saveSchedule: function() {
        localStorage.setItem("schedule", JSON.stringify(this.data));
    }

}
