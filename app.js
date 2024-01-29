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
const pollId = 1;
const pollPath = 'data/polls.json';
const resultsPath = 'data/results.json';


// Operations functions --------------
function readJSONFile(filePath) { // Function to read JSON file [Returns: JSON obj or []]
    try {
        const data = JSON.parse(fs.readFileSync(filePath)); // Read from given path and parse
        return data || [];
    } catch (error) {
        console.error(`Error loading or parsing data from ${filePath}:`, error.message);
        return [];
    }
}

function writeJSONFile(filePath, data) { // Function to write to existing JSON file [Returns: boolean success of operation]
    let writesSuccess = '';
    if (fs.existsSync(filePath)) { // Check if the file already exists
        fs.writeFile(filePath, JSON.stringify(data, null, 4), (error) => {
            if (error) {
                console.error(`Error writing to ${filePath}:`, error.message);
                writesSuccess = false;
            }
        });
        writesSuccess = true;
    } else {
        console.error(`File ${filePath} does not exist. Skipping write operation.`);
        writesSuccess = false;
    }
    return writesSuccess
}

function findPollDataById(pollId, data) { // Function to find poll matching chosen pollId [Returns: poll obj]
    data = data.find(poll => poll.pollId == pollId) || [];

    if (data.length == 0) {
        console.log(`Could not find data for pollId: ${pollId}`);
    }

    return data
}

function updateVoteCount(resultsData, selectedOption) { // Function to update vote count of selected option
    resultsData.forEach(result => { // Search through results to find results for specified pollId
        if (result.pollId == pollId) {
            result.options.forEach(option => { // Search through results to find result with matching optionId
                if (option.optionId == selectedOption) {
                    option.voteCount ++;
                }
            });
        }
    });
}


// Route handlers --------------
app.get('/', (req, res) => { // Route requests for '/' to poll page
    const title = 'Poll';
    const allPollsData = readJSONFile(pollPath);
    const pollData = findPollDataById(pollId, allPollsData);

    let status = 200;
    if (allPollsData.length == 0) { // If unable to read poll data return server error code to client
        status = 500;
    }
    res.status(status).render('poll', { title, pollData });
});

app.post('/submitOption', express.json(), (req, res) => {
    const selectedOption = req.body.selectedOption; // Extract option chosen by user from request body
    let resultsData = readJSONFile(resultsPath);

    updateVoteCount(resultsData, selectedOption); // Update vote count of chosen option

    let writeSuccess = writeJSONFile(resultsPath, resultsData);

    res.json({ success: writeSuccess, message: `Option ${selectedOption} selected` }); // Send response to client indicating submission success and verifying option chosen
});

app.get('/results', (req, res) => { // Route requests for '/results' to results page
    const title = 'Results';
    const allPollsData = readJSONFile(pollPath);
    const allResultsData = readJSONFile(resultsPath);

    const pollData = findPollDataById(pollId, allPollsData);
    const resultsData = findPollDataById(pollId, allResultsData);

    let status = 200;
    if (allPollsData.length == 0 || allResultsData.length == 0) { // If unable to read poll or results data return server error code to client
        status = 500;
    }
    res.status(status).render('results', { title, pollData, resultsData });
});

// Middleware to catch requests for unknown paths --------------
app.use((req, res) => { // Route requests for any other paths to 404 page
    const title = '404 Error';
    res.status(404).render('404', { title });
});