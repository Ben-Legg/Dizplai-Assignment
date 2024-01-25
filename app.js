// Import modules --------------
const express = require('express');
const fs = require('fs');

// Server setup --------------
const app = express(); // start an express app
app.set('view engine', 'ejs'); // regiser view engine
app.listen(3000); // listen for requests on port 3000, automatically assume address=localhost
app.use(express.static('public')); // static files for browser are in "public" folder

app.use((req, res, next) => { // log information about user requests
    console.log(`\nNew Request:\nHost: ${req.hostname}\nPath: ${req.path}\nMethod: ${req.method}`);
    next();
});

// Choose poll and declare poll data file paths --------------
const pollId = 1; // Choose poll we want to quiz people on by pollId
const pollPath = 'data/polls.json';
const resultsPath = 'data/results.json';

// Routing requests --------------
app.get('/', (req, res) => { // route requests for "/" to our poll
    let title = 'Poll';
    let pollData = [];
    try {
        let allPollsData = JSON.parse(fs.readFileSync(pollPath)); // Read poll data from file and parse to JSON
        pollData = allPollsData.find(poll => poll.pollId === pollId); // Find data object by pollId

        res.render('poll', {title, pollData});
    } catch (error) {
        console.error('Error loading or parsing poll data:', error.message);
        res.status(500).render('poll', {title, pollData});
    }
});

app.post('/submitOption', express.json(), (req, res) => { // Endpoint for POST requests when users submit poll option
    let selectedOption = req.body.selectedOption; // Extract selected option from request body
    let resultsData = [];
    try {
        resultsData = JSON.parse(fs.readFileSync(resultsPath)); // Read results data from file and parse to JSON
        resultsData.forEach(result => { // Update voteCount for selected option
            if (result.pollId == pollId) { // Find results data for current poll
                result.options.forEach(option => { // Search through each option in array
                    if (option.optionId == selectedOption) { // Increment voteCount of selected option
                        option.voteCount ++ ;
                    }
                });
            }
        });

        fs.writeFile(resultsPath, JSON.stringify(resultsData, null, 4), (error) => { // Write updated results object to results.JSON
            if (error) {
                console.error('Error writing to file:', error.message);
                res.status(500).json({ success: false, message: 'Error saving submitted option' });
            } else {
                // Send a JSON response indicating success
                res.json({ success: true, message: `Option ${selectedOption} submitted` });
            }
        });

    } catch (error) {
        console.error('Error reading existing data:', error.message);
        res.status(500).json({ success: false, message: 'Error reading results data' });
    }
});

app.get('/results', (req, res) => { // routes requests for "/results to our results page
    let title = 'Results';
    let resultsData = [];
    try {
        let allResultsData = JSON.parse(fs.readFileSync(resultsPath)); // Read results data from file and parse to JSON
        resultsData = allResultsData.find(poll => poll.pollId === pollId); // Find data object by pollId

        res.render('results', {title, resultsData});
    } catch (error) {
        console.error('Error loading or parsing results data:', error.message);
        res.status(500).render('results', {title, resultsData});
    }
});

app.use((req, res) => { // routes requests to unknown paths to 404 page
    let title = '404 Error';
    res.status(404).render('404', {title}); // sets 404 status for
});