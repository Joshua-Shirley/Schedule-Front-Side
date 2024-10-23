// Load up the calendar
// starting with the current date - today

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
    }
    catch (error) {
        console.error(error, "not an actual date.");
    }
    loadCalendar(d);
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


function loadingTitles(date) {
    // The Page Title
    document.title = 'Schedule - ' + date.toDateString();

    // Set the page title
    document.querySelector("#title-date").innerText = target.toLocaleDateString("default", { weekday: "long", month: "numeric", day: "numeric", year: "numeric" });

}

const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
if (searchParams.has("date")) {
    var target = new Date(searchParams.get("date"));

    loadingTitles(target);

    // Can I load the scheduled dates into the calendar view
    schedule.initiate(target);

    loadCalendar(target);
} else {
    var today = new Date();
    window.location.href = "schedule.html?date=" + today.toLocaleDateString().replaceAll("/", "-");
}

// Blank Page Filer
// 1 - count down to first day
// 2 - organize the json request

// General
// 1 - the json request - does it need to happen every page change? can that be reduced to one call per visit
// 2 - maybe add a forced fetch

// FIX ME - PYTHON
// 1 - Date formats - 00:00:00.000Z (requires 3 zeros)
// 2 - Change the dictionary structure to accomdate the expiration date

// FIX ME Calendar
// 1 - done - calendar pop up and close - isn't necessary per UX
// 2 - done - add in colored backgrounds for scheduled days
// 3 - skip - add in a year dropdown - this isn't completely necessary per UX
// 4 - done- "today" should be moved to the calendar pop up.

// BOOK
// 1 - can a form be submitted directly to microsoft forms
// 2 -

// SETTINGS
// 1 - phase 3 - this is to enable multiple users

// STYLE
// 1 - can bootstrap be removed for less code overhead?