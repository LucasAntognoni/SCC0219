const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const nano = require('nano')('http://localhost:5984');
const app = express();

app.use(express.static('public'));
app.use(express.static(__dirname+'/website'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

nano.db.create('petjava');
const db = nano.db.use('petjava');

app.use((err, request, response, next) => {
    if(err) {
        console.log(err)
        response.status(500).send('Server error');
    }

    console.log(request.headers);
    next();
});

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/addUser', (request, response) => {
    db.insert(request.body, (err, body, header) => {
        if(err)
            console.log('[User.insert]', err.message);
        else
            console.log('New user:\n', body);
    });
});

app.listen(3000, (err) => {
    if(err)
        console.log(err);

    else
        console.log('Server is up and running');
});
