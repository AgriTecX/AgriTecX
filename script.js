document.addEventListener("DOMContentLoaded", function () {



//--------------------------------------------------------------------------------Loading Overly---------------------------------------------------------//


var loadingOverlay = document.getElementById('loading-overlay');
showLoadingOverlay();


function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    loadingOverlay.style.display = 'none';
}


//--------------------------------------------------------------------------------User Signin status---------------------------------------------------------//

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const userName = user.displayName;
        displayTransactions();

        document.getElementById('userNameLink').textContent = userName; 
        document.getElementById('userNameGreetings').textContent = userName; 
        hideLoadingOverlay();
    } else {
        // User is not signed in
        hideLoadingOverlay(); 
        window.location.href = 'login.html';
    }
});

//--------------------------------------------------------------------------------Greeting Update---------------------------------------------------------//

function getGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning!';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon!';
  } else if (currentHour >= 18 && currentHour < 24) {
    return 'Good Evening!';
  } else {
    return 'Good Night!';
  }
}
document.getElementById('greeting').textContent = getGreeting();

//--------------------------------------------------------------------------------Dark Mode---------------------------------------------------------//

const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode === "dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus === "close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
});

//--------------------------------------------------------------------------------Logout---------------------------------------------------------//

document.getElementById('signoutbtn').addEventListener('click', logout);

// Assuming you have initialized Firebase previously

// Get a reference to the Firebase Authentication service
var auth = firebase.auth();

// Function to handle logout
function logout() {
    showLoadingOverlay(); // Call the showLoadingOverlay function before starting the logout process

    auth.signOut().then(function() {
        // Sign-out successful.
        console.log('User logged out successfully');
        // You can redirect the user to a login page or perform any other actions after logout.
    }).catch(function(error) {
        // An error happened.
        console.error('Error during logout:', error);
    });
}

//--------------------------------------------------------------------------------Minu-link and load to dash-content---------------------------------------------------------//

// Get all elements with the class "menu-link"
var menuLinks = document.querySelectorAll('.menu-link');

// Get all elements with the class "dash-content"
var dashContents = document.querySelectorAll('.dash-content');

// Add a click event listener to each menu link
menuLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
        // Prevent the default behavior of the link
        event.preventDefault();

        // Remove "active" class from all menu links
        menuLinks.forEach(function(link) {
            link.classList.remove('active');
        });

        // Add "active" class to the clicked menu link
        link.classList.add('active');

        // Get the href value of the clicked link
        var targetId = link.getAttribute('href').substring(1);

        // Hide all dash contents
        dashContents.forEach(function(content) {
            content.style.display = 'none';
        });

        // Show the corresponding dash content based on the clicked link
        var targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.style.display = 'block';
            toggleSearchBox();
        }

        // Update the URL without reloading the page
        history.pushState(null, null, '#' + targetId);
    });
});

// Listen for changes to the URL
window.addEventListener('popstate', function(event) {
    // Update the active menu link based on the current URL
    var currentHash = window.location.hash;
    menuLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });

    // Show the corresponding dash content based on the current URL
    var targetId = currentHash.substring(1);
    dashContents.forEach(function(content) {
        content.style.display = content.id === targetId ? 'block' : 'none';
    });
});


//--------------------------------------------------------------------------------Slidein PopUp--------------------------------------------------------//
var isPopupVisible = false;

function showPopup(message, isSuccess) {
    var popup = document.querySelector('.popup');
    var popupContent = document.getElementById('popupContent');

    // If the popup is currently visible, return
    if (isPopupVisible) {
        return;
    }

    // Set popup content and style based on success or error
    popupContent.textContent = message;

    if (isSuccess) {
        popupContent.style.backgroundColor = 'var(--green)';
    } else {
        popupContent.style.backgroundColor = 'var(--red)'; // Set your error color
    }

    // Show the popup with slide-in animation
    popup.classList.remove('slide-out'); // Remove slide-out class if present
    popup.classList.add('slide-in');
    popup.style.display = 'flex';
    isPopupVisible = true;

    // Hide the popup after 3 seconds with slide-out animation
    setTimeout(function () {
        // Hide the popup with slide-out animation
        popup.classList.remove('slide-in');
        popup.classList.add('slide-out');

        // Reset the flag and classes when the popup is hidden
        setTimeout(function () {
            popup.style.display = 'none';
            isPopupVisible = false;
            popup.classList.remove('slide-out');
        }, 300);
    }, 3000);
}



function clearTrasactionFrom(){
       document.getElementById("transaction-form").reset();
        document.getElementById("addTransactionBtn").disabled = true;
}

//--------------------------------------------------------------------------------vaidate add Trasaction form---------------------------------------------------------//

const form = document.getElementById('transaction-form');
const titleInput = document.getElementById('expenseTitle');
const dateInput = document.getElementById('expenseDate');
const amountInput = document.getElementById('expenseAmount');
const remarksInput = document.getElementById('expenseRemarks');
const addButton = document.getElementById('addTransactionBtn');

// Add event listeners to form elements for input validation
titleInput.addEventListener('input', validateForm);
dateInput.addEventListener('input', validateForm);
amountInput.addEventListener('input', validateForm);
remarksInput.addEventListener('input', validateForm);

// Function to validate the form and enable/disable the button
function validateForm() {
    const isFormValid = form.checkValidity();
    addButton.disabled = !isFormValid;
}

// Function to add a transaction
const transactionForm = document.getElementById("transaction-form");

transactionForm.addEventListener("submit", function (event) {
event.preventDefault();
addTransaction();
});

//--------------------------------------------------------------------------------add Trasaction---------------------------------------------------------//


function addTransaction() {
    showLoadingOverlay();
    const title = document.getElementById('expenseTitle').value;
    const date = document.getElementById('expenseDate').value;
    const amountInput = document.getElementById('expenseAmount');
    const remarks = document.getElementById('expenseRemarks').value;
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    // Get the raw value from the input
    let amount = parseFloat(amountInput.value);

    // If the toggle switch is checked, store the amount as positive; otherwise, store as negative
    amount = toggleSwitch.checked ? Math.abs(amount) : -Math.abs(amount);

    const userId = firebase.auth().currentUser.uid;

    // Reference to the "transactions" collection for the current user
    const transactionsRef = db.collection("users").doc(userId).collection("transactions");

    // Add expense data to Firestore
    transactionsRef.add({
        title: title,
        date: date,
        amount: amount,
        remarks: remarks,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Transaction added to Firestore");
        hideLoadingOverlay();
        clearTrasactionFrom(); 
        showPopup('Transaction added successfully!', true);
        displayTransactions();
    })
    .catch((error) => {
        hideLoadingOverlay(); 
        showPopup('Error adding transaction. Please try again.', false);
        console.error("Error adding transaction to Firestore:", error);
    });
}


//--------------------------------------------------------------------------------Display Trasaction---------------------------------------------------------//
// Function to display recent transactions
function displayRecentTransactions(querySnapshot) {
    const recentTableBody = document.getElementById('recentTransactionsTable').createTBody();

    if (querySnapshot.empty) {
        // Display a message when there are no recent transactions
        const noTransactionsRow = recentTableBody.insertRow();
        const noTransactionsCell = noTransactionsRow.insertCell(0);
        noTransactionsCell.colSpan = 6; // Set the colspan to match the number of columns in your table
        noTransactionsCell.textContent = 'No transactions to display';
    } else {
        querySnapshot.forEach((doc) => {
            const transactionData = doc.data();
            const row = recentTableBody.insertRow();

            // Add columns to the row
            const statusCell = row.insertCell(0);
            const dateCell = row.insertCell(1);
            const titleCell = row.insertCell(2);
            const amountCell = row.insertCell(3);
            const remarksCell = row.insertCell(4);
            const addedDateCell = row.insertCell(5);

            // Set values to the cells
            statusCell.innerHTML = transactionData.amount > 0
                ? '<i class="uil uil-arrow-down-right" style="color:#6DD64D"></i>'
                : '<i class="uil uil-arrow-up-left" style="color:#FF4842"></i>';

            dateCell.textContent = formatDate(transactionData.date);
            titleCell.textContent = transactionData.title;
            const absAmount = Math.abs(transactionData.amount);
            amountCell.innerHTML = absAmount;
            amountCell.style.color = transactionData.amount > 0 ? '#6DD64D' : '#FF4842';
            remarksCell.textContent = transactionData.remarks;
            addedDateCell.textContent = formatTimestamp(transactionData.timestamp);
        });
    }
}


// Function to display all transactions
function displayAllTransactions(querySnapshot) {
    const allTableBody = document.getElementById('allTransactionsTable').querySelector('tbody');

    if (querySnapshot.empty) {
        const noTransactionsRow = allTableBody.insertRow();
        const noTransactionsCell = noTransactionsRow.insertCell(0);
        noTransactionsCell.colSpan = 9;
        noTransactionsCell.textContent = 'No transactions to display';
    } else {
        querySnapshot.forEach((doc) => {
            const transactionData = doc.data();
            const transactionId = doc.id;
            const row = allTableBody.insertRow();
            const selectCell = row.insertCell(0);
            const statusCell = row.insertCell(1);
            const dateCell = row.insertCell(2);
            const titleCell = row.insertCell(3);
            const amountCell = row.insertCell(4);
            const remarksCell = row.insertCell(5);
            const addedDateCell = row.insertCell(6);
            const editCell = row.insertCell(7);
            const deleteCell = row.insertCell(8);

            // Add checkboxes for selection
            const selectCheckbox = document.createElement('input');
            selectCheckbox.type = 'checkbox';
            selectCheckbox.setAttribute('data-transaction-id', transactionId);
            selectCell.appendChild(selectCheckbox);

            // Set values to the cells
            statusCell.innerHTML = transactionData.amount > 0
                ? '<i class="uil uil-arrow-down-right" style="color:#6DD64D"></i>'
                : '<i class="uil uil-arrow-up-left" style="color:#FF4842"></i>';
            dateCell.textContent = formatDate(transactionData.date);
            titleCell.textContent = transactionData.title;
            const absAmount = Math.abs(transactionData.amount);
            amountCell.innerHTML = absAmount;
            amountCell.style.color = transactionData.amount > 0 ? '#6DD64D' : '#FF4842';
            remarksCell.textContent = transactionData.remarks;
            addedDateCell.textContent = formatTimestamp(transactionData.timestamp);

            // Add "Edit" button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.id = `editButton_${doc.id}`;
            editButton.addEventListener('click', () => handleEditTransaction(doc.id));
            editCell.appendChild(editButton);

            // Add "Delete" button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.id = `deleteButton_${doc.id}`;
            deleteButton.addEventListener('click', () => handleDeleteTransaction(doc.id));
            deleteCell.appendChild(deleteButton);
        });
    }
}

// Function to calculate and display totals
function calculateAndDisplayTotals(querySnapshot) {
    let totalTransactions = 0;
    let totalCredit = 0;
    let totalDebit = 0;

    querySnapshot.forEach((doc) => {
        totalTransactions++;
        const transactionData = doc.data();
        if (transactionData.amount > 0) {
            totalCredit += transactionData.amount;
        } else {
            totalDebit += Math.abs(transactionData.amount);
        }
    });

    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('totalCredit').textContent = totalCredit;
    document.getElementById('totalDebit').textContent = totalDebit;
    animateCounter('totalDebit', 0, totalDebit, 100);
    animateCounter('totalCredit', 0, totalCredit, 100);
    animateCounter('totalTransactions', 0, totalTransactions, 200);
}

// Function to display transactions
function displayTransactions() {
    const userId = firebase.auth().currentUser.uid;
    const transactionsRef = db.collection("users").doc(userId).collection("transactions");

    // Fetch recent transactions
    transactionsRef.orderBy("timestamp", "desc").limit(10).get()
        .then((querySnapshot) => {
            displayRecentTransactions(querySnapshot);
        })
        .catch((error) => {
            console.error("Error fetching recent transactions from Firestore:", error);
        });

    // Fetch all transactions
    transactionsRef.orderBy("timestamp", "desc").get()
        .then((querySnapshot) => {
            displayAllTransactions(querySnapshot);
        })
        .catch((error) => {
            console.error("Error fetching all transactions from Firestore:", error);
        });

    // Fetch all transactions to calculate totals
    transactionsRef.get()
        .then((querySnapshot) => {
            calculateAndDisplayTotals(querySnapshot);
        })
        .catch((error) => {
            console.error("Error fetching all transactions from Firestore:", error);
        });
}




//--------------------------------------------------------------------------------Update Trasaction---------------------------------------------------------//
const firestore = firebase.firestore();
// Function to delete a transaction from Firestore
function handleDeleteTransaction(transactionId) {
    showLoadingOverlay();
    const userId = firebase.auth().currentUser.uid;
    const transactionsRef = firestore.collection('users').doc(userId).collection('transactions');

    transactionsRef.doc(transactionId).delete()
        .then(() => {
            displayTransactions();
            hideLoadingOverlay();
            showPopup('Transaction deleted successfully.', true);

            console.log(`Transaction with ID ${transactionId} deleted successfully.`);
            // Optionally, you may want to update the UI or perform additional actions after deletion
            
        })
        .catch(error => {
            hideLoadingOverlay();
            console.error('Error deleting transaction:', error);
            // Handle errors, display an error message, or take appropriate action
            showPopup('Error deleting transaction. Please try again.', false);
        });
}

//--------------------------------------------------------------------------------------Select all function----------------------------------------------//

let isAllSelected = false;

    // Toggle Select All button
    const toggleSelectAllBtn = document.getElementById('toggleSelectAllBtn');
    toggleSelectAllBtn.addEventListener('click', toggleSelectAll);

    // Delete Selected button
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    deleteSelectedBtn.addEventListener('click', deleteSelected);


function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('#allTransactionsTable tbody input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = !isAllSelected;
    });

    // Toggle the state
    isAllSelected = !isAllSelected;
    deleteSelectedBtn.disabled = !isAllSelected;

}

// Function to delete selected transactions
function deleteSelected() {
    const checkboxes = document.querySelectorAll('#allTransactionsTable tbody input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
        showPopup('No transactions selected.', false);
        return;
    }

    const confirmed = confirm('Are you sure you want to delete the selected transactions?');

    if (confirmed) {
        checkboxes.forEach(checkbox => {
            const transactionId = checkbox.getAttribute('data-transaction-id');
            
            // Implement your logic to delete the selected transaction using the transactionId
            handleDeleteTransaction(transactionId);
        });
    }
}


//--------------------------------------------------------------------------------format date---------------------------------------------------------//

function formatDate(date) {
    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-GB', options).replace(/\//g, '-');
}

function formatTimestamp(timestamp) {
    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return timestamp.toDate().toLocaleDateString('en-GB', options).replace(/\//g, '-');
}

//--------------------------------------------------------------------------------counterup animation---------------------------------------------------------//

function animateCounter(targetId, startValue, endValue, duration) {
            const element = document.getElementById(targetId);
            const increment = (endValue - startValue) / duration;
            let currentValue = startValue;

            function updateCounter() {
                currentValue += increment;
                element.textContent = Math.round(currentValue);

                if (currentValue < endValue) {
                    requestAnimationFrame(updateCounter);
                }
            }

            updateCounter();
        }


function toggleSearchBox() {
    const activeLinks = document.querySelectorAll('.menu-link');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    let shouldDisplaySearchBox = false;

    activeLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (link.classList.contains('active') && (href === '#view-transactions' || href === '#view-pesticides')) {
            shouldDisplaySearchBox = true;
            searchInput.value = ''; // Clear the value of the searchInput

            // Trigger the filtering logic
            filterTableRows(searchInput.value.toLowerCase());
        }
    });

    searchBox.style.display = shouldDisplaySearchBox ? 'block' : 'none';
}

// Initial check on page load
toggleSearchBox();

// JavaScript code to filter table rows based on search input
document.getElementById('searchInput').addEventListener('input', function () {
    filterTableRows(this.value.toLowerCase());
});

function filterTableRows(query) {
    const rows = document.querySelectorAll('#allTransactionsTable tbody tr');

    rows.forEach(row => {
        const visible = Array.from(row.cells).some(cell => cell.textContent.toLowerCase().includes(query));
        row.style.display = visible ? 'table-row' : 'none';
    });
}


document.addEventListener('DOMContentLoaded', function () {
    // Get the current URL
    const currentURL = window.location.href;

    // Extract the hash value from the URL
    const hashIndex = currentURL.indexOf('#');
    const currentHash = hashIndex !== -1 ? currentURL.substring(hashIndex) : '';

    // Find the corresponding menu link and add the "active" class
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });
});

});