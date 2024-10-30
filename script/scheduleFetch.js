const schedule = {
    date: null,
    url: "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/daily",
    data: null,
    credentials: null,
    //expire : null,
    initiate: function (date = (new Date()), callback) {
        // save the callback function reference
        this.callback = callback;

        // set the date for the date view
        this.date = date;

        // check credentials
        this.credentials = this.getCredentials();

        // Get local
        this.getLocal();

        // build the html elements from the data and load it.
        this.loadView();
    },
    get: function () {        
        fetch(this.url)
            .then(response => response.json())
            .then(data => {
                
                // set the data expiration                        
                var expiration = schedule.setExpire();

                // merge the new data into the existing data
                this.mergeData(data, expiration);

                // callback
                this.callback();
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
                    // set the data expiration                        
                    var expiration = schedule.setExpire();

                    // merge the new data into the existing data
                    this.mergeData(data, expiration);

                    // callback
                    this.callback();
                }
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    },
    getCredentials: function() {
        if( localStorage.getItem("settings") ){   
            const obj = {};         
            var settings = JSON.parse(localStorage.getItem("settings"));
            obj["userId"] = settings.passNumber;
            obj["password"] = settings.password;
            obj["date"] = schedule.date.toISOString();
            return obj
        }
        var message = { 
            "tag" : "div",
            "children" : [
                {
                    "tag" : "p",
                    "innerText" : "Invalid Credentials - Add valid credentials on the settings page."
                },
                {
                    "tag" : "a",
                    "attributes" : [
                     {"href": "settings.html"}
                    ],
                    "innerText" : "Settings Page"
                }
            ]                        
        }        
        errorDisplay.throw("Credentials", message);

        return null;
    },
    updateData: function (dictItem) {

        // Get the expiration
        var expiration = null;
        for (var index = dictItem.length - 1; index > 0; index--) {
            if (dictItem[index].hasOwnProperty("expiration")) {
                expiration = new Date(dictItem[index]["expiration"]);
                break;
            }
        }

        // Update the data if it is old             
        if (expiration == null || expiration.getTime() > (new Date()).getTime()) {
            //console.log("data expired get more.");
            //this.get();
            this.post();
            return true;
        }
        return false;
    },
    setExpire: function () {
        var expireMinutes = 5;        
        var expDate = new Date();
        expDate.setMinutes(expDate.getMinutes() + expireMinutes);
        return { "expiration": expDate.toISOString() };
    },
    mergeData: function (newData, expiration) {        
        // iterate through the data and merge it
        Object.keys(newData).forEach(function (key) {
            // set an item expiration on each dict object
            newData[key].push(expiration);

            // over write each date
            schedule.data[key] = newData[key];
        });

        // save the result
        schedule.saveLocal();
    },
    saveLocal: function () {
        localStorage.setItem("schedule", JSON.stringify(schedule.data));
    },
    getLocal: function () {
        // check localStorage for the objects
        if (!localStorage.hasOwnProperty("schedule")) {
           
            var today = {
                "acivity": "Off (Regular Day Off)",
                "assignment": "Not checked out",
                "start date": (new Date()).toISOString(),
                "end date": (new Date()).toISOString(),
                "hours": 0
            }

            var array = [];
            array.push(today);

            var sch = {};
            sch[(new Date()).toISOString()] = array;
            localStorage.setItem("schedule", JSON.stringify(sch));

            this.post();            
        }
        // add the schedule to 
        schedule.data = JSON.parse(localStorage.getItem("schedule"));
    },
    loadView: function () {
        // find the daily array objects
        try {
            if (this.data.hasOwnProperty(this.date.toISOString().replace("000Z","00Z"))) {

                var daily = this.data[this.date.toISOString().replace("000Z","00Z")];

                // does the data need to be updated?
                if (this.updateData(daily)) {
                    console.log("updated");
                }
                daily.pop();
            }
            else {
                var daily = null;
            }
        }
        catch (error) {
            console.error(error);
            return;
        }

        // load the schedule views                        
        var block = new Blocks(daily, this.date);

        // add schedule highlights to the calendar

    }
}