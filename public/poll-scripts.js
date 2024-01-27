document.addEventListener('DOMContentLoaded', () => { // Wait until DOM is loaded

    window.addEventListener('pageshow', () => { // Remove classes for previous poll submission when revisiting page
        let prevChoice = document.querySelector('.selected');
        let prevSubmission = document.querySelector('.submitted');

        if (prevChoice) { // Remove '.selected' from any elements
            prevChoice.classList.remove('selected');
        }
        if (prevSubmission) { // Remove '.submitted' from any elements
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
                setTimeout(() => { // Remove '.not-selected' after 0.5s
                    submitButton.classList.remove('not-selected');
                }, 500);
            } else {
                let selectedOption = selectedButton.id; // Get ID of option chosen
                
                fetch('/submitOption', { // POST JSON to endpoint for handling selected option
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ selectedOption }), // Convert to JSON obj to JSON-formatted string
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