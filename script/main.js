function findNextEvent(data, date = new Date()){
    // verify data json
    if( !data instanceof Object) {
        console.error("Not a json object");
    }
    // Test the date parameter that it is type Date
    if( !date instanceof Date ) {
        console.error("Not a date object");
        return false;
    }
    // format the date 
    // set hours, minutes, seconds, and milliseconds to zero
    var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    
    // search the json object for the current date.    
    index = 0
    try {
        while( !data.hasOwnProperty(newDate.toISOString()) ) 
        {       
            newDate.setDate( newDate.getDate() + 1)        
            if(index++ == 120){
                console.error("No event scheduled within the next 120 days.")
                break;
            }
        }
    }
    catch (error) {
        console.error("No property found: ", error)
    }

    return newDate;
}

var blank = new Date()
var today = new Date(blank.getFullYear(), blank.getMonth(), blank.getDate(), 0, 0 , 0, 0);