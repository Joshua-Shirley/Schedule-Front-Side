const validateUser = {
    // create a lambda function that validates the user
    url : "https://4z2h7s7pze.execute-api.us-west-1.amazonaws.com/v1/validate",
    initiate: function(settings, callback) {
        this.settings = settings;        
        this.credentials = this.getCredentials();
        this.data = this.post(callback);
        // confirm name and resort match
        this.response = null;      
    },    
    post: function(callback) {        
        fetch(this.url, {method : "POST", body : JSON.stringify(this.credentials), headers : { "Content-Type" : "application/json"} })
            .then(response => response.json())
            .then(data => {                
                if ( data.hasOwnProperty("result") ) {
                    // if (data["result"] == "pass"){                        
                    //     console.log("validation passed") 
                    //     settings.validated = true;    
                        
                    //     // update area
                    //     settings.skiArea = data.details.area;
                    //     // update full name
                    //     settings.fullName = data.details.instructor;

                    //     // check name difference
                    //     if ( (settings.firstName + ' ' + settings.lastName) != settings.fullName  ) {
                    //         console.error("name don't match ", settings.fullName);
                    //         settings.validated = false;
                    //     }                        
                    // } 
                    // else if (data["result"] == "fail"){
                    //     console.log("validation failed")
                    //     this.settings.validated = false; 
                    // }   
                    callback(data);
                    return data;                               
                }
            })
            .catch(error => {
                console.error("Error: ", error);
            });
    },

    getCredentials: function() {
        const obj = {};
        obj["userId"] = this.settings.passNumber;
        obj["password"] = this.settings.password;
        return obj;
    },
}