const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const nano = require('nano')('http://localhost:5984');
const couchDBModel = require('couchdb-model');

const app = express();

app.use(express.static('public'));
app.use(express.static(__dirname+'/website'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

nano.db.create('users');
const users = nano.db.use('users');

app.post('/addUser', (request, response) => {
    users.insert(request.body, (err, body, header) => {
        if(err) {
            console.log('[User.insert]', err.message);
            response.send(false);
        }
        else
            response.send(true);
    });
});

const usersModel = couchDBModel(users);

app.post('/loginUser', (request, response) => {
    usersModel.findAll((err, results) => {
        if(err)
            console.log('[User.find]', error);
        else
            Promise.all(results.filter(element => {
                // Verifica se cada dado do DB é igual ao requisistado.
                return element.email === request.body.email && element.psw === request.body.psw;
            })).then(data => {
                if(data.length > 0)
                    response.send(true);
                else
                    response.send(false);
            });
    });
});

app.listen(3000, (err) => {
    if(err)
        console.log(err);

    else
        console.log('Server is up and running');
});
