const settings = {
    initiate: function() {
        var temp = JSON.parse(localStorage.getItem("settings"));
        Object.keys(temp).forEach( key => {
            settings[key] = temp[key];
        });
    }
}
settings.initiate();