const pageLoad = {
    rolling: null,
    initiate: function (callback) {
        this.url = new URL(window.location.href);
        this.params = new URLSearchParams(this.url.search);
        if (this.params.has("date")) {
            this.rolling = this.tryParse(this.params.get("date"));
            if (!this.rolling) {
                errorDisplay.throw("Invalid Date", "Invalid date: " + this.rolling);
            }
            if (callback) {
                callback();
            }
            loadFullSchedule.initiate(this.rolling);
        }
        else {
            // fresh params
            let param = new URLSearchParams();
            param.set("date", (new Date()).toISOString());

            this.url.search = param;
            // load up error on page so it doesn't loop
            // window.location.href = url.toString();

            // load an error
            errorDisplay.throw("Data Error", "Not a valid date.");
        }
    },
    tryParse: function (datestring) {
        const date = new Date(datestring);
        if (isNaN(date.getTime())) {
            errorDisplay.throw("Date Error", "Not a date.")
            return null;
        } else {
            return date;
        }
    },
    linkWithDate: function (date) {
        if (date instanceof Date) {
            const params = new URLSearchParams();
            params.append("date", this.zeroDate(date).toISOString());
            pageLoad.url.search = "";
            pageLoad.url.search = params;
            return this.url.toString();
        }
        else {
            throw "Error - not a date";
        }
    },
    zeroDate: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
}

// Callback function - after data loads
function thisPage() {

    // Update Titles and Date Strings
    document.querySelector("#title-date").innerText = pageLoad.rolling.toLocaleDateString("default", { weekday: "long", month: "2-digit", day: "2-digit", year: "numeric" });

    // Schedule Details
    schedule.initiate(pageLoad.rolling);            
                
    // Calendar
    const calendar = new Calendar(pageLoad.rolling, new URLControl(), schedule.data);
    var calendarView = document.querySelector("#calendarHolder");
    calendarView.innerHTML = "";
    calendarView.append( builder(calendar.view()));

    // add in any schedule classes
    // can I move this into the calendar build?
    calendarSchedule(pageLoad.rolling.getMonth() , pageLoad.rolling.getFullYear());
    
    // Swipe Controls
    loadSwipe();
}

function calendarSchedule(monthNumber, year) {
    // load the schedule
    const list = Object.keys(loadFullSchedule.data);
    const keys = list.filter((key) => (new Date(key)).getMonth() == monthNumber && new Date(key).getFullYear() == year);
    console.log(keys);
    keys.forEach(key => {
        var activities = loadFullSchedule.data[key];
        if (activities.length > 0) {
            activities.forEach(activity => {
                if (activity.hasOwnProperty("activity")) {

                    var description = activity["activity"].toLowerCase();

                    if (!description.includes("regular day off")) {

                        try {
                            var dateString = (new Date(key)).toLocaleString("default", { month: "2-digit", day: "2-digit", year: "numeric" }).replaceAll("/", "-");
                            var targetElement = document.querySelector("a[date='" + dateString + "']");
                        }
                        catch {
                            console.log(dateString, " not found");
                        }

                        targetElement.classList.add("scheduled");

                        if (activity["assignment"].toLowerCase().includes("private request")) {
                            // private request
                            targetElement.classList.add("privateRequest");
                        }
                    }
                }
            });
        }
    });
}        
// load the page detail      
function loadSwipe() {            
    // Swiper
    var assignments = { "right": swipeRight, "left": swipeLeft };
    // is it possible to constrict to content that is not .calendar
    swiper.initiate(document.querySelector("div#content"), assignments);

    // assign swiper commands to the calendar block as well.           
}

// SWIPE CONTROLS
function swipeRight() {
    var previous = new Date(pageLoad.rolling.setDate(pageLoad.rolling.getDate() - 1));
    // FIX - change link
    //window.location.assign("swiper.html?date=" + previous.toISOString());            
    window.location.assign( (new URLControl(previous)).link() );
}

function swipeLeft() {
    var next = new Date(pageLoad.rolling.setDate(pageLoad.rolling.getDate() + 1));
    // FIX - change link 
    window.location.assign( (new URLControl(next)).link() );
}


pageLoad.initiate(thisPage);