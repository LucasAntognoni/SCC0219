$(document).ready(function() {

  $('table, button, #formAgenda').hide();

  $( '#calendario' ).datepicker({
    onSelect: function (date) {
      $('h1, p').hide();
      $('table, button').show();
      $('#data').html(date);
    }
  });

  $('#Agendar').click(function() {
    $('#slots').hide();
    $('#formAgenda').show();
  });
});

var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

$(document).ready(function() {

  var request = indexedDB.open("agenda", 3);

  request.onupgradeneeded = function(event) {
    var db = event.target.result;

    if(!db.objectStoreNames.contains('agenda'))
    {
      var objectStore = db.createObjectStore("agenda", { keyPath: "ID", autoIncrement:true});
      objectStore.createIndex('serviço','serviço',{unique:false});
      objectStore.createIndex('animal', 'animal',{unique:false});
      objectStore.createIndex('cliente','cliente',{unique:false});
      objectStore.createIndex('data','data',{unique:false});
    }
  };

  request.onerror = function(event) {
  console.log('Erro: não foi possível conectar ao Banco de Dados...');
  console.log("Erro:", event.target.error.name);
  };

  request.onsuccess = function(event) {
    console.log('Conectado ao Banco de Dados...');
    db = event.target.result;
  };
});

function agendarServico() {

  var servico = $('#servico').val();
  var animal = $('#animal').val();
  var cliente = $('#cliente').val();
  var data = $('#calendario').datepicker().getDate();

  var transaction = db.transaction(["agenda"], "readwrite");

  // Request for objectStore
  var store = transaction.objectStore("agenda");

  // Define horario
  var horario = {
    s:servico,
    a:animal,
    c:cliente,
    d:data
  };

  // Adding entry
  var request = store.add(horario);

  // Error
  request.onerror = function(event) {
    alert("Não foi possível adicionar o horário!");
    console.log("Erro:", event.target.error.name);
  }

  // Success
  request.onsuccess = function(event) {
      alert("Horário agendado com sucesso!");
  }
}

function listarHorarios(event) {

  var transaction = db.transaction(["agenda"], 'readonly');
  var os = transaction.objectStore("agenda");
  var index = os.index('data');
  var d = $('#data').val();
  var table = document.getElementById("#slots");
  var row;
  var i = 0;
  var output = "";

  index.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;

    if(cursor){
      if(cursor.value.data === d)
      {
        row = table.rows[i];
        col = row.cells[1];

        output += "+cursor.value.servico+";
        output += "+cursor.value.animal+";
        output += "+cursor.value.cliente+";
        $(col).html(output);

        i += 1;
      }
    }

    index.openCursor().onerror = function(event){
        console.log("Error:", e.target.error.name);
    };
  }
}
