const Application = {
    initiate() {   
        Application.form = document.settings;             
        Application.loadSettings();
        Application.addListeners();
    },
    addListeners() {
        let form = document.settings;
        form.addEventListener("submit", Application.validateForm);
                                
        // First Name
        let firstName = document.getElementById("first");
        firstName.addEventListener("input", Application.validateName);
        firstName.addEventListener("focusout", Application.validateName);

        // Last Name
        let lastName = document.getElementById("last");
        lastName.addEventListener("input", Application.validateName);
        lastName.addEventListener("focusout", Application.validateName);

        // Pass Number
        let passNumber = document.getElementById("passNumber");
        passNumber.addEventListener("input", Application.formatPassNumber);

        // Pass word
        let password = document.getElementById("password");
        password.addEventListener("change", Application.validatePassWord);

        // Validation Button
        let validation = document.getElementById("checkValidation");
        validation.addEventListener("click", Application.validateLogin);
    },
    validateForm(ev) {
        // Step 2 - Validate 
        ev.preventDefault();
        //let form = ev.target;
        //console.log(ev);    
        
        Application.saveSettings();

        let button = document.querySelector("button[name='validate']");
        if( ev.target.checkValidity() ) {            
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    },
    formatPassNumber(ev) {
        let input = ev.target;
        let value = input.value;  
        input.setCustomValidity("");      
    },
    validatePassWord(ev) {
        let input = ev.target;
        let value = input.value; 
        input.setCustomValidity("");
    },
    validateName(ev) {
        let input = ev.target;
        let value = input.value;
        const pattern = /\d/;
        
        input.setCustomValidity('');
        if( pattern.test(value) ) {
            value = value.replace( pattern , "");
            input.value = value;
            
            input.setCustomValidity( "No digits allowed.  A-Z, a-z only.");
            //input.reportValidity(); 
            
            input.parentElement.querySelector("div.invalid-feedback").innerText = "No digits allowed.  A-Z, a-z only.";
            input.parentElement.querySelector("div.invalid-feedback").classList.add("show");
        }
        else {
            input.parentElement.querySelector("div.invalid-feedback").classList.remove("show");
            //input.reportValidity();
        }
    },
    validateLogin() {
        let result = validateUser.initiate(settings, Application.callback);
        console.log(result);
    },
    callback(data) {                
        settings.validated = false;
        if( data.result == "pass" ) {
            settings.validated = true;
            settings.fullName = data.details.instructor;
            settings.skiArea = data.details.area;

            // mark the settings as complete validation
            document.getElementById("credentialsValidated").checked = true;

            // reveal the next page button link
            
        } else {
            settings.validated = false;

            // Pass Number 
            let passNumber = document.getElementById("passNumber");
            passNumber.setCustomValidity("failed");

            // Pass word
            let password = document.getElementById("password");
            password.setCustomValidity("failed");       
            
            let validationCheckbox = document.getElementById("credentialsValidated");
            validationCheckbox.checked = false;
            validationCheckbox.setCustomValidity("failed");
        }        
    },
    loadSettings() {
        // Step 0 - Does the settings local storage exist?
        // accomplished with the loadSettings.js

        // Step 1 - Load Settings
        // First, Last, Passnumber, Password
        // save to settings
        Object.keys(settings).forEach(key => {
            var input = Application.form.querySelector("input[name=" + key + "]");
            if (input) {
                input.value = settings[key];
            }
            if (key == "validated") {
                var input = Application.form.querySelector("input[name=validated]");
                input.checked = settings[key];
            }
        });
    },
    saveSettings() {
        Application.form.querySelectorAll("input").forEach(input => {
            //console.log(input.name, input.value);
            if (settings.hasOwnProperty(input.name)) {
                settings[input.name] = input.value;
            }
            settings.save();
        });
    }
}

//Application.initiate();
document.addEventListener("DOMContentLoaded", Application.initiate);

// Step 3 - validate user
// confirm returned values match

function validate() {
    console.log("validate");
    validateUser.initiate(settings);
}

// Step 4 - (background event) Fetch current season

// Step 5 - confirm resort area
