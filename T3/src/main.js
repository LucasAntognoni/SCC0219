const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const nano = require('nano')('http://localhost:5984');
const app = express();

app.use(express.static(__dirname +'/website/public'));
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

app.use('script', express.static(__dirname + '/website/js/'));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname+'index.html'));
});

app.get('/index.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/about.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/about.html'));
});

app.get('/login_cadastro/login.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/login_cadastro/login.html'));
});
app.get('/login_cadastro/cadastro.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/login_cadastro/cadastro.html'));
});
app.get('/ganhos/ganhos.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/ganhos/ganhos.html'));
});
app.get('/vendas/vendaProdutos.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/vendas/vendaProdutos.html'));
});
app.get('/vendas/vendaServicos.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/vendas/vendaServicos.html'));
});
app.get('/gerenciamento/produtos.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/gerenciamento/produtos.html'));
});
app.get('/gerenciamento/servicos.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/gerenciamento/servicos.html'));
});
app.get('/agendamento/agendamento.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/agendamento/agendamento.html'));
});
app.get('/forms/animals.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/forms/animals.html'));
});
app.get('/forms/prods.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/forms/prods.html'));
});
app.get('/forms/servs.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/forms/servs.html'));
});

app.get('/carrinho/checkout.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/carrinho/checkout.html'));
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
