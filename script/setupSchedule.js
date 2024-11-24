const allSeasons = {
    url: "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/season",
    messageElement: null,
    initiate: function () {
        this.messageElement = document.querySelector("#setupMessages");
        var years = parseInt(settings.seasonRange);
        var currentYear = new Date().getFullYear();
        for(var index = 0; index <= years; index++) {
            var seasonDate = new Date(currentYear - index, 10, 1);
            var element = this.startMessage(seasonDate);
            this.progressBarAnnimation( element.querySelector("div.progress > div") );            
            var credentials = settings.credentials(seasonDate);
            this.post(credentials, element);            
        }
    },
    progressBarAnnimation: function(element) {        
        var width = 0;
               
        async function delayedLoop() {
            for(var width = 0; width <= 100; width++) {
                allSeasons.progressBarSetWidth(element, width);
                await new Promise(resolve => setTimeout(resolve, 500));                
            }
        }
        
        delayedLoop();
    },
    progressBarSetWidth: function(element, width) {
        element.innerText = width.toString() + "%";
        element.style.width = width + "%";
    },
    startMessage: function(date) {        
        const season = (date.getFullYear()) + '-' + (date.getFullYear() + 1);
        const id = "season" + season.replace("-","");
        const message = "has started.";
        var obj = {
            "tag" : "div",
            "class" : ["row"],            
            "children" : [
                {   
                    "tag" : "div",
                    "class" : "col-4",
                    "innerText" : season
                },
                {
                    "tag": "div",
                    "class" : "col-8",
                    "children": [
                        {
                            "tag": "div",
                            "id" : id,
                            "class" : ["progress"],
                            "attributes": [
                                { "role" : "progressbar"},
                                { "aria-label" : "Animated striped"},
                                { "aria-valuenow" : "1" },
                                { "aria-valuemin": "0"},
                                { "aria-valuemax": "100"}
                            ],
                            "children" : [
                                {
                                    "tag": "div",
                                    "class": ["progress-bar","bg-success"],
                                    "attributes": [
                                        { "style" : "width: 0%;"}
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]            
        }

        var element = builder(obj);
        this.messageElement.append(element);
        return element;
    },
    finishMessage: function(date) {
        //element.innerText = element.innerText.replace("has started", " - complete");
        console.log("callback: " + date);
    },
    post: function(credentials, element) {      
        fetch(this.url, {
            method: "POST", 
            body: JSON.stringify(credentials), 
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {      
            this.progressBarSetWidth( element.querySelector("div.progress-bar") , 100 );            
        })
        .catch(error => {
            console.error("Error: ", error);
        });
    },  
}