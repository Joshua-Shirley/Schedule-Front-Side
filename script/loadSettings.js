const settings = {
    properties: ["firstName", "lastName", "fullName", "skiArea", "passNumber", "password", "validated", "seasonRange"],
    initiate: function () {
        if (localStorage.hasOwnProperty("settings")) {
            var temp = JSON.parse(localStorage.getItem("settings"));
            // transfer the keys and key values to this const settings
            // 
            var settingsHook = false;
            Object.keys(temp).forEach(key => {
                if (temp[key] != null) {
                    this[key] = temp[key];
                } else {
                    this[key] = null;
                    settingsHook = true;
                }
            });
            if (settingsHook) {
                console.log("settings -> redirect to settings ");
            }
        } else {                       
            settings.properties.forEach(key => {
                settings[key] = null;
                if (key == "validated") {
                    settings[key] = false;
                }
                if (key == "seasonRange") {
                    settings[key] = 0;
                }
            })
            //localStorage.setItem("settings", JSON.stringify(settingsObject));            
            console.log("blank settings");
            //location.reload();
            settings.save();
        }
    },
    save: function () {
        let obj = {};
        settings.properties.forEach(key => {
            obj[key] = settings[key];
        })
        localStorage.setItem("settings", JSON.stringify(obj));
    },
    clear: function () {
        localStorage.removeItem("settings");
    },
    credentials: function (date = null) {
        if (settings.validated) {
            const obj = {}
            obj["userId"] = settings.passNumber;
            obj["password"] = settings.password;
            if (date != null) {
                obj["date"] = date.toISOString();
            }
            return obj;
        } else {
            console.error( "Settings are not validated.")
            var message = {
                "tag": "div",
                "children": [
                    {
                        "tag": "p",
                        "innerText": "Invalid Credentials - Add valid credentials on the settings page."
                    },
                    {
                        "tag": "a",
                        "attributes": [
                            { "href": "welcome.html" }
                        ],
                        "innerText": "Welcome Page"
                    }
                ]
            }
            errorDisplay.throw("Credentials", message);
        }
    }
}
settings.initiate();