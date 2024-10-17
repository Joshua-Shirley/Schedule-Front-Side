// Builder() takes a JSON object and creates a new html object
function builder(obj) {
    // deal with arrays
    if (Array.isArray(obj)) {
        // do array stuff      
        var blank = {
            "tag" : "div",
            "classes" : "blank-holder",
            "children" : obj
        }  
        builder(blank);
    };
    if (!obj.hasOwnProperty("tag")) { return null; }
    var block = document.createElement(obj["tag"]);
    if (obj.hasOwnProperty("class")) {
        if (Array.isArray(obj["class"])) {
            block.classList.add(...obj["class"]);
        } else {
            block.classList.add(obj["class"]);
        }
    }
    if (obj.hasOwnProperty("attributes")){
        if(Array.isArray(obj["attributes"])){
            obj["attributes"].forEach(child => {                 
                const keys = Object.keys(child);
                keys.forEach( key => {
                    block.setAttribute(key, child[key]);
                });
            });               
        }
    }
    if (obj.hasOwnProperty("id")) {
        block.id = obj["id"];
    }
    if (obj.hasOwnProperty("innerText")) {
        block.innerText = obj["innerText"];
    }
    if (obj.hasOwnProperty("innerHTML")) {
        if (typeof obj["innerHTML"] === "object") {
            block.appendChild(builder(obj["innerHTML"]));
        }
        else {
            block.innerHTML = obj["innerHTML"];
        }
    }
    if (obj.hasOwnProperty("children")) {
        if (Array.isArray(obj["children"])) {
            obj["children"].forEach(child => {
                block.append(builder(child));
            });
        }
        else if (typeof obj["children"] === "object") {
            block.append(builder(obj["children"]));
        }
    }
    return block;
}
