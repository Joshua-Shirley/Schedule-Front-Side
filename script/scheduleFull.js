const seasonSchedule = {
    date : null,
    season: null,   
    bucket: "https://instructor-snow-com.s3.us-west-1.amazonaws.com/data/",
    data: null,
    url: null,
    userId: null,
    password: null,
    initiate: function(userId, password, date) {
        this.userId = userId;
        this.password = password;
        this.date = date;
        if ( this.date.getMonth() > 9 ){
            this.season = this.date.getFullYear() + '-' + this.date.getFullYear() + 1 + ".json";
        } else {
            this.season = this.date.getFullYear() - 1 + '-' + this.date.getFullYear() + ".json";
        }
        this.url = this.createUrl();
        this.get();
    },
    createUrl: function() {
        return this.bucket + this.userId + "/" + this.season;
    },
    get: function () {        
        fetch(this.url)
            .then(response => response.json())
            .then(data => {
                console.log(data);                
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    },
    post: function() {
        fetch(this.url, {method : "POST", body : JSON.stringify(this.credentials), headers : { "Content-Type" : "application/json"} })
            .then(response => response.json())
            .then(data => {                
                if ( !data.hasOwnProperty("error") ) {
                    // 
                    console.log(data);               
                }
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    }
}

function pastSeasons() {
    const settings = JSON.parse(localStorage.getItem("settings"));
    var rollingYear = new Date().getFullYear() - parseInt(document.querySelector("input#seasonRange").value);
    while( rollingYear < new Date().getFullYear()){
        console.log(rollingYear);
        seasonSchedule.initiate( settings.passNumber, settings.password, new Date(rollingYear,12,1) );
        rollingYear++;
    }    
}