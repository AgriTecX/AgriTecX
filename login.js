document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');
    var signupForm = document.getElementById('signupForm');
    var toggleFormLink = document.getElementById('toggleForm');
    var loadingOverlay = document.getElementById('loading-overlay');
    var emailInput = document.querySelector('.login_email');
    var passwordInput = document.querySelector('.login_password');
    var loginbtn = document.getElementById('loginbtn');
    var errorMessageContainer = document.getElementById('login-error-message-container');

    loginbtn.setAttribute('disabled', 'disabled');

    // Initialize Firebase Authentication
    const auth = firebase.auth();

function checkFormValidity() {
    // Check if there are any error message divs in the container
    var hasErrorMessages = errorMessageContainer.querySelector('.error-message') !== null;

    // Enable or disable the submit button based on the presence of error messages
    loginbtn.disabled = hasErrorMessages;
}

// Add event listeners to email and password inputs
emailInput.addEventListener('input', checkFormValidity);
passwordInput.addEventListener('input', checkFormValidity);

emailInput.addEventListener('blur', function () {
    var emailValue = emailInput.value.trim();
    var errorMessage = document.getElementById('login-email-error-message');

    if (!emailValue) {
        clearErrorMessage(errorMessage);
    } else {
        validateLoginEmailFormat(emailValue, errorMessage);
    }
});

passwordInput.addEventListener('blur', function (event) {
    var passwordValue = event.target.value.trim();
    var errorMessage = document.getElementById('login-password-error-message');
    
    if (!passwordValue) {
        clearErrorMessage(errorMessage);
    } else {
        validatePassword(passwordValue, errorMessage);
    }
});

function validatePassword(passwordValue, errorMessage) {
    if (passwordValue.length < 6) {
        displayErrorMessage('Password must be at least 6 characters.', errorMessage, 'login-password-error-message');
    } else {
        clearErrorMessage(errorMessage);
    }
}


function validateLoginEmailFormat(email, errorMessage) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        displayErrorMessage('Incorrect email format.', errorMessage, 'login-email-error-message');
    } else {
        clearErrorMessage(errorMessage);
    }
}

function displayErrorMessage(message, errorMessage, errorMessageId) {
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.id = errorMessageId;
        document.getElementById('login-error-message-container').appendChild(errorMessage);
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


emailInput.addEventListener('blur', function () {
    // ... (your existing code)
    checkFormValidity();
});

passwordInput.addEventListener('blur', function (event) {
    // ... (your existing code)
    checkFormValidity();
});

function checkFormValidity() {
    var emailErrorMessage = document.getElementById('login-email-error-message');
    var passwordErrorMessage = document.getElementById('login-password-error-message');
    var emailInput = document.querySelector('.login_email');
    var passwordInput = document.querySelector('.login_password');
    var isAnyInputEmpty =
        !emailInput.value.trim() ||
        !passwordInput.value.trim();

    if (!emailErrorMessage && !passwordErrorMessage && !isAnyInputEmpty) {
        loginbtn .removeAttribute('disabled');
    } else {
        loginbtn .setAttribute('disabled', 'disabled');
    }
}

    loginForm.addEventListener('submit', function () {
        event.preventDefault();
        showLoadingOverlay(); // Show the loading overlay on form submission
        validateLoginForm();
    });

    

function validateLoginForm() {
var email = document.querySelector('.login_email').value;
var password = document.querySelector('.login_password').value;
var errorMessage = document.getElementById('login-error-message');

auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        hideLoadingOverlay(); // Hide the loading overlay after form submission
        var user = userCredential.user;
        displaySuccessMessage("Login successful!");
        var countdown = 3;
        var countdownInterval = setInterval(function () {
            displaySuccessMessage("Already Logged in! <br> Redirecting you to home in " + countdown + " sec");
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                // Redirect to login page after countdown
                window.location.href = 'index.html';
            }
        }, 1000);
        console.log(user);
        // Add your logic for successful sign-in
    })
    .catch((error) => {
        hideLoadingOverlay(); // Hide the loading overlay after form submission
        var errorCode = error.code;
        var errorMessageText = error.message; // Use a different variable for error message
         if (errorCode === "auth/user-not-found") {
                displayErrorMessage("Email not registered"); 
            } else if (errorCode === "auth/invalid-login-credentials") {
                displayErrorMessage("Invalid login credentials");  
            } else {
             displayErrorMessage(errorCode);  
            }
        console.error(errorMessageText);

        
    });

function displaySuccessMessage(message) {
    var successMessageContainer = document.getElementById('login-error-message-container');
    var successMessage = document.createElement('div');
    successMessage.className = 'error-message';
    successMessage.innerHTML = message;
    successMessage.style.color = '#00cc00';
    successMessage.style.backgroundColor = 'rgba(0, 204, 0, 0.3)';
    successMessageContainer.innerHTML = ''; // Clear existing messages
    successMessageContainer.appendChild(successMessage);
}

function displayErrorMessage(message) {
    var errorMessageContainer = document.getElementById('login-error-message-container');
    var errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = message;
    errorMessage.style.color = '#ff3333';
    errorMessage.style.backgroundColor = 'rgba(255, 4, 0, 0.47)';
    errorMessageContainer.innerHTML = ''; 
    errorMessageContainer.appendChild(errorMessage);
}
}

function showLoadingOverlay() {
        loadingOverlay.style.display = 'flex';
    }

    function hideLoadingOverlay() {
        loadingOverlay.style.display = 'none';
    }


    // Add this code where you initialize Firebase and set up your app
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
    var successMessageContainer = document.getElementById('login-error-message-container');
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


