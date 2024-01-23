document.addEventListener('DOMContentLoaded', () => { // Wait until DOM is loaded
    
    // Event listeners for option buttons
    const optionButtons = document.querySelectorAll('.option'); // Select options buttons
    optionButtons.forEach(button => { // Add event listeners for each option button
        button.addEventListener('click', function () {
            optionButtons.forEach(btn => btn.classList.remove('selected')); // De-select other options
            button.classList.toggle('selected'); // Select button chosen
        });
    });
    
    
    // Event listener for submit button
    const submitButton = document.querySelector('.submit'); // Select submit button
    submitButton.addEventListener('click', () => { // Add event listeners
        
        const isOptionClicked = Array.from(optionButtons).some(btn => btn.classList.contains('selected')); // Find if any option button has been selected
        if (!isOptionClicked) { // If no options are selected give class 'not-selected' for 2 seconds
            submitButton.classList.toggle('not-selected');
            setTimeout(() => {
                submitButton.classList.remove('not-selected');
            }, 2000);
        } else {
            submitButton.classList.toggle('selected');
        }
    });
});