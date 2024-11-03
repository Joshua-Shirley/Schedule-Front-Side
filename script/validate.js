const validateUser = {
    // create a lambda function that validates the user
    url : "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/validate",
    initiate: function(callback = null) {
        this.credentials = this.getCredentials();
        this.data = this.post();
        // confirm name and resort match
        this.result = false;
        this.callback = callback;
    },
    updateSettings: function(passed) {
        const settings = JSON.parse(localStorage.getItem("settings"))        
        settings["validated"] = passed;
        localStorage.setItem("settings", JSON.stringify(settings));
    },
    post: function() {        
        fetch(this.url, {method : "POST", body : JSON.stringify(this.credentials), headers : { "Content-Type" : "application/json"} })
            .then(response => response.json())
            .then(data => {                
                if ( data.hasOwnProperty("result") ) {
                    if (data["result"] == "pass"){
                        this.result = true;
                        console.log("validation passed") 
                        this.updateSettings(true);     
                        
                        if(this.callback != null) {
                            this.callback();
                        }
                    } 
                    else if (data["result"] == "fail"){
                        console.log("validation failed")
                        this.updateSettings(false);
                    }    
                    return data;                               
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
}