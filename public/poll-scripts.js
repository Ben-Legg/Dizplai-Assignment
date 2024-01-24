document.addEventListener('DOMContentLoaded', () => { // Wait until DOM is loaded

    // Event listeners for option buttons
    let optionButtons = document.querySelectorAll('.option'); // Select options buttons
    optionButtons.forEach(button => { // Add event listeners for each option button
        button.addEventListener('click', function () {
            optionButtons.forEach(btn => btn.classList.remove('selected')); // De-select other options
            button.classList.toggle('selected'); // Select button chosen
        });
    });
    
    
    // Event listener for submit button
    let submitButton = document.querySelector('.submit'); // Select submit button
    if (submitButton) {  
        submitButton.addEventListener('click', () => { // Add event listeners
            
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
                    console.log('Option submitted successfully:', data); // Log response to console
                    window.location.href = '/results';
                })
                .catch(error => { // Log errors occuring during fetch request
                    console.error('Error submitting option:', error);
                });
            }
        });
    }
});