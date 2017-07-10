const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const couchDBModel = require('couchdb-model');

const nano = require('nano')('http://localhost:5984');
const app = express();

app.use(express.static(__dirname +'/view/public'));
app.use(express.static(__dirname+'/view'));

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
    response.sendFile(path.join(__dirname+'/view/index.html'));
});


app.get('/agendamento/agendamento.html', (request, response) => {
    response.sendFile(path.join(__dirname+'/view/agendamento/agendamento.html'));
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
          if(err) {
              console.log('[Horario.find]', error);
              response.send(false);
          }
          else
              Promise.all(results.map(element => {
                  if (element.data === request.body.data) {
                    return {
                      animal: element.animal,
                      cliente: element.cliente,
                      data: element.data,
                      servico: element.servico
                    }
                  }
              })).then(data => {
                  response.send(data);
              }).catch(console.log);
      });
});

app.listen(3000, (err) => {
    if(err)
        console.log(err);
    else
        console.log('Server is up and running');
});
