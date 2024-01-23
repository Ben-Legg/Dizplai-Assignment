const express = require('express');
const app = express();// start an express app

app.set('view engine', 'ejs');// regiser view engine

app.listen(3000); // listen for requests, automatically assume address=localhost

app.use((req, res, next) => { // log information about user requests
    console.log('\nNew Request:');
    console.log('host:', req.hostname);
    console.log('path:', req.path);
    console.log('method:', req.method);
    next();
});

app.get('/', (req, res) => { // routes requests for "/" to our poll
    const title = 'Poll';
    res.render('poll', {title});
});