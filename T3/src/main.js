const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const nano = require('nano')('http://localhost:5984');
const couchDBModel = require('couchdb-model');
const app = express();

app.use(express.static(__dirname +'/website/public'));
app.use(express.static(__dirname+'/website'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

nano.db.create('petjava');
const db = nano.db.use('petjava');

nano.db.create('products');
const products = nano.db.use('products');
const productsModel = couchDBModel(products);


nano.db.create('users');
const users = nano.db.use('users');

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
        if(err) {
            console.log('[User.find]', error);
            response.send(false);
        }
        else
            Promise.all(results.filter(element => {
                // Verifica se cada dado do DB é igual ao requisistado.
                return element.email === request.body.email && element.psw === request.body.psw;
            })).then(data => {
                if(data.length > 0)
                    response.send(true);
                else
                    response.send(false);
            }).catch(console.log);;
    });
});

app.post('/showCustomers', (request, response) => {
    usersModel.findAll((err, results) => {
        if(err) {
            console.log('[User.find]', error);
            response.send(false);
        }
        else
            Promise.all(results.map(element => {
                return {
                    name: element.name,
                    email: element.email
                }
            })).then(data => {
                response.send(data);
            }).catch(console.log);
    })
});

app.post('/addUser', (request, response) => {
    db.insert(request.body, (err, body, header) => {
        if(err)
            console.log('[User.insert]', err.message);
        else
            console.log('New user:\n', body);
    });
});

app.post('/addProduct', (request, response) => {
    db.insert(request.body, (err, body, header) => {
        if(err)
            console.log('[Product.insert]', err.message);
        else
            console.log('New product:\n', body);
    });
});

app.post('/addService', (request, response) => {
    db.insert(request.body, (err, body, header) => {
        if(err)
            console.log('[Service.insert]', err.message);
        else
            console.log('New service:\n', body);
    });
});

nano.db.create('horarios');
const horarios = nano.db.use('horarios');
const horarioModel = couchDBModel(horarios);


app.post('/addHorario', (request, response) => {

  horarios.insert(request.body, (err, body, header) => {
    if (err)
      console.log('[Horario.insert]', err.message);
    else
      console.log('Novo Horário:\n', body);
  });
});

app.post('/removerHorario', (request, response) => {

  horarioModel.findAll((err, results) => {
      if(err)
          console.log('[Horario.find]', error);
      else
          Promise.all(results.filter(element => {
              return element.animal === request.body.animal && element.data === request.body.data;
          })).then(dado => {
              if(dado.length > 0)
                document.delete(function(error) {
                  if (error) console.error('failed to delete document');
                  else console.log('document deleted.');
                });
              else
                  response.send(false);
          });
  });
});

app.post('/listHorarios', (request, response) => {
  horarioModel.findAll((err, results) => {
         if(err)
             console.log('[Horario.find]', error);
         else
             Promise.all(results.filter(element => {
                 return element.data === request.body.data;
             })).then(data => {
                 if(data.length > 0)
                     response.send(true);
                 else
                     response.send(false);
             });
     });
});

app.post('/addAnimal', (request, response) => {
    db.insert(request.body, (err, body, header) => {
        if(err)
            console.log('[Animal.insert]', err.message);
        else
            console.log('New animal:\n', body);
            response.sendFile(path.join(__dirname+'/forms/sucessAnimal.html'));
          });
});

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

/*app.post('/allProducts', (request, response) => {
  productsModel.findAll((err, results) => {
    var results = [];
      if(err)
          console.log('[User.find]', error);
      else
        provides('JSON', function() {
          Promise.all(results.filter(element => {
            if(element.category == 'Product')
              results.push({
                      id: row.value.id,
                      prodname: row.value.address,
                      description: row.value.description,
                      preco: row.value.preco,
                      estoque:row.value.estoque,
                      qtdeVendida: row.value.qtdeVendida,
                      image: row.value.image,
                });
            }));
            // make sure to stringify the results :)
            send(JSON.stringify(results));
        });
    });
});*/



app.listen(3000, (err) => {
    if(err)
        console.log(err);

    else
        console.log('Server is up and running');
});
