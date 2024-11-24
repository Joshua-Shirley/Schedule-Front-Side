class ProgressBar {
    constructor(innerText) {   
        const pattern = /\W/gi;     
        this.barId = innerText.replaceAll(pattern,"");
        this.progressbar = this.progressBarElement();
        this.bar = this.barElement( this.barId, this.progressbar );
        this.row = this.rowElement( this.bar, innerText );        

        this.element = builder(this.row); 
        this.domProgressBar = null;  
        this.cancelAnimation = false;     
    }

    async animate() {
        const pause = 200;  // 100 units * .20 milliseconds = 20 seconds
        for(var width = 0; width <= 100; width++) {
            this.setWidth(width);            
            await new Promise(resolve => setTimeout(resolve, pause));     
            if ( this.cancelAnimation ){                
                break;
            }
        }
    }

    cancel() {
        //console.log("cancel");
        this.cancelAnimation = true;
    }

    finish() {
        //console.log("finished");
        this.cancelAnimation = true;
        this.setWidth(100);
    }
    
    zero() {
        //console.log("zero");
        this.cancelAnimation = true;
        this.setWidth(0);
    }

    setWidth(width) {

        if( this.domProgressBar == null ) {
            this.domProgressBar = document.querySelector("#" + this.barId + " > div.progress-bar");
        }

        this.domProgressBar.style.width = width + "%";
        this.domProgressBar.innerText = width + "%";
        this.domProgressBar.parentElement.setAttribute("aria-valuenow", width);
    }

    progressBarElement() {
        var bar = {
            "tag" : "div", 
            "class" : ["progress-bar", "bg-success"],
            "style" : "width: 1%",
            "innerText" : "0%" 
        }
        return bar;
    }

    barElement(id, progressBar) {
        var barObject = {
            "tag" : "div",
            "id" : id,
            "class" : ["progress"],
            "attributes" : [
                { "role" : "progressbar" },
                { "aria-label" : "Animated striped" },
                { "aria-valuenow" : "1" },
                { "aria-valuemin" : "0" },
                { "aria-valuemax" : "100" }            
            ],
            "children" : [ progressBar ]
        }
        return barObject;
    }

    rowElement(bar, innerText) {
        var obj = {
            "tag" : "div",
            "class" : [ "row" ],
            "children" : [
                {
                    "tag" : "div",
                    "class" : ["col-6", "text-end"],
                    "innerText" : innerText
                },
                {
                    "tag" : "div",
                    "class" : ["col-6", "text-start" ],
                    "children" : [ bar ]
                }
            ]
        }
        return obj;
    }

}