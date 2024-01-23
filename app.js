const express = require('express');
const app = express();// start an express app

app.set('view engine', 'ejs');// regiser view engine

app.listen(3000); // listen for requests, automatically assume address=localhost

app.use(express.static('public')); // static files for browser are in "public" folder

app.use((req, res, next) => { // log information about user requests
    console.log('\nNew Request:');
    console.log('host:', req.hostname);
    console.log('path:', req.path);
    console.log('method:', req.method);
    next();
});


// Routing requests

app.get('/', (req, res) => { // routes requests for "/" to our poll
    const title = 'Poll';
    res.render('poll', {title});
});

app.get('/results', (req, res) => { // routes requests for "/results to our results page
    const title = 'Results';
    res.render('results', {title});
});

app.use((req, res) => { // routes requests to unknown paths to 404 page
    const title = '404 Error';
    res.status(404).render('404', {title}); // sets 404 status for
});