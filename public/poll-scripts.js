document.addEventListener('DOMContentLoaded', () => { // Wait until DOM is loaded

    window.addEventListener('pageshow', () => { // Remove classes for previous poll submission when revisiting page
        let prevChoice = document.querySelector('.selected');
        let prevSubmission = document.querySelector('.submitted');

        if (prevChoice) {
            prevChoice.classList.remove('selected');
        }
        if (prevSubmission) {
            prevSubmission.classList.remove('submitted');
        }
    });

    // Event listeners for option buttons
    let optionButtons = document.querySelectorAll('.option'); // Select options buttons
    optionButtons.forEach(button => { // Option button event listeners
        button.addEventListener('click', function () {
            optionButtons.forEach(btn => btn.classList.remove('selected')); // De-select other options
            button.classList.toggle('selected'); // Select button chosen
        });
    });
    
    
    // Event listener for submit button
    let submitButton = document.querySelector('.submit'); // Select submit button
    if (submitButton) {  
        submitButton.addEventListener('click', () => { // Submit button event listener
            
            let selectedButton = document.querySelector('.selected');
            
            if (!selectedButton) { // If no options are selected give class 'not-selected' for 2 seconds
                submitButton.classList.toggle('not-selected');
                setTimeout(() => {
                    submitButton.classList.remove('not-selected');
                }, 500);
            } else {
                let endpoint = '/submitOption'; // Server endpoint for handling selected option
                let selectedOption = selectedButton.id; // Get ID of option chosen
                
                fetch(endpoint, { // Send POST request to endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Sent as JSON
                    },
                    body: JSON.stringify({ selectedOption }), // Convert to JSON string
                })
                .then(response => response.json()) // Convert response from server
                .then(data => {
                    console.log(`Submitted: ${data.success}\t Message: ${data.message}`); // Log response
                    submitButton.classList.toggle('submitted');
                    setTimeout(() => { // Redirect the page after a 0.5s delay
                        window.location.href = '/results';
                    }, 500);
                })
                .catch(error => { // Log errors occuring during fetch request
                    console.error('Error submitting option:', error);
                });
            }
        });
    }
});