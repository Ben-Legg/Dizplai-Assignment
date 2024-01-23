// Import modules --------------
const express = require('express');
const fs = require('fs')

// Server setup --------------
const app = express(); // start an express app
app.set('view engine', 'ejs'); // regiser view engine
app.listen(3000); // listen for requests on port 3000, automatically assume address=localhost
app.use(express.static('public')); // static files for browser are in "public" folder

app.use((req, res, next) => { // log information about user requests
    console.log('\nNew Request:');
    console.log('host:', req.hostname);
    console.log('path:', req.path);
    console.log('method:', req.method);
    next();
});


// Routing requests --------------
app.get('/', (req, res) => { // routes requests for "/" to our poll
    const title = 'Poll';
    const pollId = 1; // Choose poll we want to quiz people on by pollId
    let choices = [];
    let question = '';
    try {
        const allPollsData = JSON.parse(fs.readFileSync('data/polls.json')); // Read poll data from file and parse to JSON
        const pollData = allPollsData.find(poll => poll.pollId === pollId); // Find data object by pollId
        
        if (pollData) { // save poll data if poll with desired ID is found
            question = pollData.question;

            // Seach through option array to find poll options
            const optionOne = pollData.options.find(option => option.optionId === 1);
            const optionTwo = pollData.options.find(option => option.optionId === 2);
            const optionThree = pollData.options.find(option => option.optionId === 3);

            if (optionOne && optionTwo && optionThree) { // save option text if poll has three options
                choices = [
                    {option: optionOne.optionText},
                    {option: optionTwo.optionText},
                    {option: optionThree.optionText},
                ];
            } else {
                console.log(`Options not found for pollId: ${pollId}.`);
            }
        } else {
            console.log(`Poll with pollId: ${pollId} not found.`);
        };
        
        res.render('poll', {choices, title, question});
        
    } catch (error) {
        console.error('Error loading or parsing poll data:', error);
        res.status(500).render('poll', {choices, title});
    }
    
});

app.get('/results', (req, res) => { // routes requests for "/results to our results page
    const title = 'Results';
    res.render('results', {title});
});

app.use((req, res) => { // routes requests to unknown paths to 404 page
    const title = '404 Error';
    res.status(404).render('404', {title}); // sets 404 status for
});