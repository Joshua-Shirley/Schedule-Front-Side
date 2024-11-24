class FileStatus {
    constructor(settings) {
        this.settings = settings;
        
        // build data object
        this.tableData = this.tableBuild();

        // get the file last modified date
        this.update(this.settings.passNumber);

        // create table from object
    }

    tableBuild() {
        let data = [];
        const currentYear = new Date().getFullYear();
        for( var year = 0; year <= this.settings.seasonRange; year++) {
            var fileName = (currentYear - year) + "-" + (currentYear - year + 1);
            
            var obj = {};
            obj.exist = false;
            obj.season = fileName;
            obj.datetime = null;                    
            obj.age = "0:00";
            
            data.push(obj);
        }  
        return data;
    }

    fetch2(filename) {
        const bucket = "https://instructor-snow-com.s3.us-west-1.amazonaws.com/";
        const url = bucket + "data/" + this.settings.passNumber + "/" + filename + ".json";
        
        fetch(url , {method: "HEAD"})
        .then( response => {
            if(response.ok) {

            }
        })


        return new Promise( function(resolve, reject) {
            fetch( url , { method: "HEAD" })
            .then(response => {
                if(response.ok) {                    
                    resolve( response.headers.get("Last-Modified") )
                }
                else {                    
                    reject( false )
                }
            })
            .catch( reject(false) )           
        });                 
    }

    update(passNumber) {
        const bucket = "https://instructor-snow-com.s3.us-west-1.amazonaws.com/";
        
        function path(filename) {
            return bucket + "data/" + passNumber + "/" + filename + ".json";
        }

        for( var index = 0; index < this.tableData.length; index++) {
            var url = path(this.tableData[index].season);
            fetch( url , {method : "HEAD"})
            .then( response => {                
                if( response.ok ) {                    
                    var modified = new Date(response.headers.get("Last-Modified"));
                    this.updateLine(index, modified);                    
                }
            })
            .catch()
        }
    }

    updateLine(index, modifiedDate) {
        console.log( index , modifiedDate )
        this.tableData[index].exist = true;
        this.tableData[index].datetime = modifiedDate;
        this.tableData[index].age = this.timeDifference( new Date() , modifiedDate );
    }

    updateTableData() {

        for( var i = 0 ; i < this.tableData.length; i++ ) {
            //console.log( this.tableData[i].season )
            this.fetch( this.tableData[i].season )
            .then(message => {
                console.log("message: " + message);
                if(message != false) {
                    this.tableData[i].exist = true;
                    this.tableData[i].datetime = new Date(message);
                    this.tableData[i].age = this.timeDifference( new Date() , new Date(message));
                }
            })
        }
    }

    timeDifference(dateA, dateB) {
        const diff = dateA.getTime() - dateB.getTime();
        
        const milliseconds = diff % 1000;
        let remainder = diff - milliseconds

        const seconds = remainder % (1000 * 60) / 1000;
        remainder = remainder - (seconds * 1000);

        const minutes = remainder % (1000 * 60 * 60) / ( 1000 * 60 );
        remainder = remainder - ( minutes * 1000 * 60)

        const hours = remainder % ( 1000 * 60 * 60 * 24 ) / ( 1000 * 60 * 60);
        remainder = remainder - ( hours * 1000 * 60 * 60)

        const days = remainder

        return hours.toString().padStart(2,"0") + ":" + minutes.toString().padStart(2,"0") + ":" + seconds.toString().padStart(2,"0")
    }
}

const fileStatus = new FileStatus(settings);
