// import express from 'express';
// import bodyParser from 'body-parser';
// import path from 'path';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname+'/view'));
app.use(express.static(__dirname+'/script'));

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

app.listen(3000, (err) => {
    if(err)
        console.log(err);

    else
        console.log('Server is up and running');
});
