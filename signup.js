document.addEventListener('DOMContentLoaded', function () {
var loadingOverlay = document.getElementById('loading-overlay');
var nameInput = document.querySelector('.signup_name');
var emailInput = document.querySelector('.signup_email');
var phoneInput = document.querySelector('.signup_phone');
var passwordInput = document.querySelector('.signup_password');
var signupbtn = document.getElementById('signupbtn');
var errorMessageContainer = document.getElementById('signup-error-message-container');

signupbtn.setAttribute('disabled', 'disabled');

const auth = firebase.auth();

signupForm.addEventListener('submit', function () {
        event.preventDefault();
        showLoadingOverlay(); // Show the loading overlay on form submission
        validateSignupForm();
    });



nameInput.addEventListener('input', checkFormValidity);
emailInput.addEventListener('input', checkFormValidity);
phoneInput.addEventListener('input', checkFormValidity);
passwordInput.addEventListener('input', checkFormValidity);

nameInput.addEventListener('blur', function () {
    var nameValue = nameInput.value.trim();
    var errorMessage = document.getElementById('signup-name-error-message');

    if (!nameValue) {
        clearErrorMessage(errorMessage);
    } else {
        validateName(nameValue, errorMessage);
    }
});

phoneInput.addEventListener('blur', function () {
    var phoneValue = phoneInput.value.trim();
    var errorMessage = document.getElementById('signup-phone-error-message');

    if (!phoneValue) {
        clearErrorMessage(errorMessage);
    } else {
        validatePhoneNumber(phoneValue, errorMessage);
    }
});



emailInput.addEventListener('blur', function () {
    var emailValue = emailInput.value.trim();
    var errorMessage = document.getElementById('signup-email-error-message');

    if (!emailValue) {
        clearErrorMessage(errorMessage);
    } else {
        validateLoginEmailFormat(emailValue, errorMessage);
    }
});

passwordInput.addEventListener('blur', function (event) {
    var passwordValue = event.target.value.trim();
    var errorMessage = document.getElementById('signup-password-error-message');
    
    if (!passwordValue) {
        clearErrorMessage(errorMessage);
    } else {
        validatePassword(passwordValue, errorMessage);
    }
});

function validateName(nameValue, errorMessage) {
    // You can customize the name validation logic based on your requirements
    // For simplicity, let's assume the name should contain at least two words
    var nameParts = nameValue.split(' ');

    if (nameParts.length < 2) {
        displayErrorMessage('Please enter both first name and last name.', errorMessage, 'signup-name-error-message');
    } else {
        clearErrorMessage(errorMessage);
    }
}

// Add validation for a 20-digit phone number
function validatePhoneNumber(phoneValue, errorMessage) {
    // Assuming a valid phone number is exactly 20 digits
    var phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneValue)) {
        displayErrorMessage('Please enter a 10-digit phone number.', errorMessage, 'signup-phone-error-message');
    } else {
        clearErrorMessage(errorMessage);
    }
}

function validatePassword(passwordValue, errorMessage) {
    if (passwordValue.length < 6) {
        displayErrorMessage('Password must be at least 6 characters.', errorMessage, 'signup-password-error-message');
    } else {
        clearErrorMessage(errorMessage);
    }
}


function validateLoginEmailFormat(email, errorMessage) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        displayErrorMessage('Incorrect email format.', errorMessage, 'signup-email-error-message');
    } else {
        clearErrorMessage(errorMessage);
    }
}

function displayErrorMessage(message, errorMessage, errorMessageId) {
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.id = errorMessageId;
        document.getElementById('signup-error-message-container').appendChild(errorMessage);
    }

    errorMessage.innerHTML = message;
    errorMessage.style.color = '#ff3333';
    errorMessage.style.backgroundColor = 'rgba(255, 4, 0, 0.47)';
}

function clearErrorMessage(errorMessage) {
    if (errorMessage) {
        errorMessage.parentNode.removeChild(errorMessage);
    }
}

function checkFormValidity() {
    var errorMessageContainer = document.getElementById('signup-error-message-container');

    var emailInput = document.querySelector('.signup_email');
    var passwordInput = document.querySelector('.signup_password');
    var nameInput = document.querySelector('.signup_name');
    var phoneInput = document.querySelector('.signup_phone');

    // Check if any input field is empty
    var isAnyInputEmpty =
        !emailInput.value.trim() ||
        !passwordInput.value.trim() ||
        !nameInput.value.trim() ||
        !phoneInput.value.trim();

    // Check if there is any content inside the error message container
    var isErrorMessageContainerEmpty = !errorMessageContainer || errorMessageContainer.innerHTML.trim() === '';

    if (!isAnyInputEmpty && isErrorMessageContainerEmpty) {
        signupbtn.removeAttribute('disabled');
    } else {
        signupbtn.setAttribute('disabled', 'disabled');
    }
}



























function validateSignupForm() {
    var name = document.querySelector('.signup_name').value;
    var email = document.querySelector('.signup_email').value;
    var phone = document.querySelector('.signup_phone').value;
    var password = document.querySelector('.signup_password').value;
    var errorMessageElement = document.getElementById('signup-error-message');

    // Create user with email and password
auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed up
        var user = userCredential.user;
        var userId = user.uid;  // Get the user ID from the userCredential
        var signupDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        
        

        user.updateProfile({
            displayName: name,
        });


        getDeviceDetailsAndSaveToFirestore(userId, name, email, phone, signupDateTime);

        // Send email verification
        user.sendEmailVerification()
            .then(() => {
                // Email sent
                console.log("Email verification sent");
            })
            .catch((error) => {
                console.error("Error sending email verification", error);
            });
        // Display success message and instruct the user to verify their email
        clearForm(); // Assuming you have a function to disable the form
        hideLoadingOverlay(); // Hide the loading overlay after form submission
        displaySuccessMessage("Registration successful! Please check your email for verification.");

        // Optionally, you can add a link/button for users to manually request a new verification email
        // Display a message like "Didn't receive the email? Click here to resend."

        console.log(user);
    })
    .catch((error) => {
        hideLoadingOverlay(); // Hide the loading overlay after form submission
        var errorCode = error.code;
        var errorMessageText = error.message;
        console.error(errorMessageText);

        if (errorCode === "auth/email-already-in-use") {
            displayErrorMessage("The email address is already in use by another account");
        } else if (errorCode === "auth/invalid-email") {
            displayErrorMessage("The email address is badly formatted");
        } else {
            displayErrorMessage(errorMessageText);
        }
    });


function clearForm() {
    // Replace "your-form-id" with the actual ID of your form
    var form = document.getElementById("signupForm");

    if (form) {
        // Reset the form, which clears all input fields
        form.reset();
    }
}






function displaySuccessMessage(message) {
    var successMessageContainer = document.getElementById('signup-error-message-container');
    var successMessage = document.createElement('div');
    successMessage.className = 'error-message';
    successMessage.innerHTML = message;
    successMessage.style.color = '#00cc00';
    successMessage.style.backgroundColor = 'rgba(0, 204, 0, 0.3)';
    successMessageContainer.innerHTML = ''; // Clear existing messages
    successMessageContainer.appendChild(successMessage);    
}

function displayErrorMessage(message) {
    var errorMessageContainer = document.getElementById('signup-error-message-container');
    var errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = message;
    errorMessage.style.color = '#ff3333';
    errorMessage.style.backgroundColor = 'rgba(255, 4, 0, 0.47)';
    errorMessageContainer.innerHTML = ''; 
    errorMessageContainer.appendChild(errorMessage);
}
}

function getDeviceDetailsAndSaveToFirestore(userId, name, email, phone, signupDateTime) {
    // Get device details (browser and OS)
    var userAgent = navigator.userAgent;
    var browser = getBrowser(userAgent);
    var os = getOperatingSystem(userAgent);

    // Get IP address using a third-party service (ipinfo.io)
    fetch('https://ipinfo.io/json')
        .then(response => response.json())
        .then(data => {
            // Use the obtained device details
            var deviceDetails = {
                browser: browser || 'Unknown Browser',
                os: os || 'Unknown OS',
                ip: data.ip || 'Unknown IP'
                // Add more details as needed
            };

            // Log the deviceDetails object before storing it in Firestore
            console.log('Device Details:', deviceDetails);

            // Call saveUserToFirestore with obtained deviceDetails
            saveUserToFirestore(userId, name, email, phone, signupDateTime, deviceDetails);
        })
        .catch(error => {
            console.error('Error fetching IP address:', error);

            // If an error occurs, store default or empty values
            var deviceDetailsOnError = {
                browser: 'Unknown Browser',
                os: 'Unknown OS',
                ip: 'Unknown IP'
                // Add more details as needed
            };

            // Log the deviceDetails object with default values
            console.log('Device Details (Error):', deviceDetailsOnError);

            // Call saveUserToFirestore with default deviceDetails
            saveUserToFirestore(userId, name, email, phone, signupDateTime, deviceDetailsOnError);
        });
}


function saveUserToFirestore(userId, name, email, phone, signupDateTime, deviceDetails) {
    // Get a reference to the Firestore database
    const db = firebase.firestore();

    // Calculate the membershipValidTill date by adding 1 year to the current date and time
    const membershipValidTill = new Date();
    membershipValidTill.setFullYear(membershipValidTill.getFullYear() + 1);

    // Convert the date to the "Asia/Kolkata" timezone
    const membershipValidTillInTimeZone = membershipValidTill.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

    // Create an object with valid and defined values for each field, including deviceDetails
    const userData = {
        name: name || '',
        email: email || '',
        phone: phone || '',
        signupDateTime: signupDateTime || new Date(),
        deviceDetails: deviceDetails || {},  // Ensure deviceDetails is not undefined
        membershipValidTill: membershipValidTillInTimeZone || null  // Add membershipValidTill field
    };

    // Add user data to the "users" collection
    db.collection("users").doc(userId).set(userData)
        .then(() => {
            console.log("Successful");
        })
        .catch((error) => {
            console.error("Error saving user data:", error);
        });
}





function getBrowser(userAgent) {
    // Implement logic to extract browser information from userAgent
    // This is a simplified example
    if (/chrome/i.test(userAgent)) {
        return 'Chrome';
    } else if (/firefox/i.test(userAgent)) {
        return 'Firefox';
    } else if (/safari/i.test(userAgent)) {
        return 'Safari';
    } else if (/msie|trident/i.test(userAgent)) {
        return 'Internet Explorer';
    } else {
        return 'Unknown';
    }
}

function getOperatingSystem(userAgent) {
    // Implement logic to extract operating system information from userAgent
    // This is a simplified example
    if (/windows/i.test(userAgent)) {
        return 'Windows';
    } else if (/macintosh|mac os/i.test(userAgent)) {
        return 'Mac OS';
    } else if (/android/i.test(userAgent)) {
        return 'Android';
    } else if (/iphone/i.test(userAgent)) {
        return 'iOS';
    } else {
        return 'Unknown';
    }
}


    function showLoadingOverlay() {
        loadingOverlay.style.display = 'flex';
    }

    function hideLoadingOverlay() {
        loadingOverlay.style.display = 'none';
    }
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        hideLoadingOverlay(); // Hide the loading overlay after form submission
        var displayName = user.displayName;
        displaySuccessMessage("Already Logged in as " + displayName + "!");

        var countdown = 3;
        var countdownInterval = setInterval(function () {
            displaySuccessMessage("Already Logged in as " + displayName + "! <br> Redirecting you to home in " + countdown + " sec");
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                // Redirect to login page after countdown
                window.location.href = 'index.html';
            }
        }, 1000);
        
    } else {
        hideLoadingOverlay(); // Hide the loading overlay after form submission

        

    }
})

function displaySuccessMessage(message) {
    var successMessageContainer = document.getElementById('signup-error-message-container');
    var successMessage = document.createElement('div');
    successMessage.className = 'error-message';
    successMessage.innerHTML = message;
    successMessage.style.color = '#00cc00';
    successMessage.style.backgroundColor = 'rgba(0, 204, 0, 0.3)';
    successMessageContainer.innerHTML = ''; // Clear existing messages
    successMessageContainer.appendChild(successMessage);    
}
showLoadingOverlay(); // Show the loading overlay on form submission
   
});
