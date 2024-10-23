function loadingTitles(date) {    
    try {
        // The Page Title
        document.title = 'Schedule - ' + date.toDateString();

        // Set the page title
        document.querySelector("#title-date").innerText = target.toLocaleDateString("default", { weekday: "long", month: "numeric", day: "numeric", year: "numeric" });
    }
    catch (error) {
        console.error(error);
    }
}

function loadCalendar(date) {
    const calendar = new Calendar(date);
    var calendarView = document.querySelector("#calendarHolder");
    calendarView.innerHTML = "";
    calendarView.append(builder(calendar.view()));
    
    // add in any schedule classes
    calendarSchedule(date.getMonth());
}

function loadMonth(date) {
    try {
        var d = new Date(date);
        loadCalendar(d);
    }
    catch (error) {
        console.error(error, "not an actual date.");
        return;
    }    
}

function calendarSchedule(monthNumber) {
    // load the schedule
    const list = Object.keys(schedule.data);
    const keys = list.filter((key) => (new Date(key)).getMonth() == monthNumber);
    keys.forEach(key => {
        var activities = schedule.data[key];
        if (activities.length > 0) {
            activities.forEach(activity => {
                if (activity.hasOwnProperty("activity")) {
                    
                    var description = activity["activity"].toLowerCase();
                    
                    if (!description.includes("regular day off")) {
                                                                        
                        try {
                            var dateString = (new Date(key)).toLocaleString("default", { month: "2-digit", day: "2-digit", year: "numeric"}).replaceAll("/","-");
                            var targetElement = document.querySelector("a[date='" + dateString + "']");                            
                        }
                        catch {
                            console.log(dateString, " not found");
                        }      
                        
                        targetElement.classList.add("scheduled");

                        if(activity["assignment"].toLowerCase().includes("private request")) {
                            // private request
                            targetElement.classList.add("privateRequest");
                        }
                    }
                }
            });
        }
    });
}