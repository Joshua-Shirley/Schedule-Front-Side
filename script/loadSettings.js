const settings = {
    properties : ["firstName","lastName","phoneNumber","emailAddress","fullName","skiArea","passNumber","password","validated","seasonRange"],
    initiate: function() {
        if (localStorage.hasOwnProperty("settings")) {
            var temp = JSON.parse(localStorage.getItem("settings"));
            // transfer the keys and key values to this const settings
            // 
            var settingsHook = false;
            Object.keys(temp).forEach( key => {                
                if (temp[key] != null) {
                    this[key] = temp[key];
                } else {
                    this[key] = null;
                    settingsHook = true;
                }                
            });
            if (settingsHook) {
                console.log( "settings -> redirect to settings ");
            }
        } else {
            var settingKeys = ["firstName","lastName","phoneNumber","emailAddress","fullName","skiArea","passNumber","password","validated","seasonRange"]
            var settings = {};
            settingKeys.forEach( key => {
                settings[key] = null;
                if (key == "validated") {
                    settings[key] = false;
                }
            })            
            localStorage.setItem("settings", JSON.stringify(settings));
            console.log("blank settings");
        }
    },
    save: function() {
        let obj = {};
        settings.properties.forEach( key => {
            obj[key] = settings[key];
        })
        localStorage.setItem("settings", JSON.stringify(obj));
    },
    clear: function() {        
        localStorage.removeItem("settings");
    }
}
settings.initiate();