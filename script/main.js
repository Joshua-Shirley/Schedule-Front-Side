async function getData(universalLocationResource) {
    const url = universalLocationResource;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Response status: ${response.status}');
        }
        const contentType = response.headers.get("content-type");
        if(!contentType || !contentType.includes("application/json")){
            throw new TypeError("Not a json file");
        }
        data = await response.json();        
    } catch (error) {
        console.error(error.message);
    }
}

Date.prototype.compareDate = function (dateB) {
    if (this.getFullYear() == dateB.getFullYear()) {
        if (this.getMonth() == dateB.getMonth()) {
            if (this.getDate() == dateB.getDate()) {
                return true;
            }
        }
    }
    return false;
};

const url = "https://instructor-snow-com.s3.us-west-1.amazonaws.com/2024-2025.json";
let data = {};
getData(url)
season = data["2024-2025"]
const today = new Date(2024,10,8);
const firstDate = new Date(2024,11,24);
console.log(firstDate.toISOString())